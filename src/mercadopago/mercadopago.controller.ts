import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { Request, Response } from "express";
import "dotenv/config";
import { orm } from '../shared/orm.js'
import { Producto } from '../producto/producto.entity.js'
import { Venta } from "../venta/venta.entity.js";
import { ItemVenta } from "../item-venta/item.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";
import { Distribuidor } from "../distribuidor/distribuidor.entity.js";

const em = orm.em;

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_SANDBOX as string,
});

export const createPreference = async (req: Request, res: Response) => {
  const em = orm.em.fork();
  
  try {
    const { items, clienteId, distribuidorId } = req.body;

    // Validaciones básicas
    if (!items?.length) return res.status(400).json({ error: "Carrito vacío" });
    if (!clienteId) return res.status(400).json({ error: "Falta cliente" });
    if (!distribuidorId) return res.status(400).json({ error: "Falta distribuidor" });

    let ventaId = 0;

    await em.transactional(async (em) => {
      // Verificar cliente y distribuidor
      const cliente = await em.findOneOrFail(Cliente, { id: clienteId });
      const distribuidor = await em.findOneOrFail(Distribuidor, { id: distribuidorId });

      // Verificar stock
      for (const item of items) {
        const producto = await em.findOneOrFail(Producto, { id: item.id });
        if (producto.stock < item.quantity) {
          throw new Error(`Sin stock: ${producto.name} (Stock: ${producto.stock}, Solicitado: ${item.quantity})`);
        }
      }

      // Crear venta
      const venta = em.create(Venta, {
        fecha: new Date(),
        total: 0,
        estado: "pendiente",
        cliente,
        distribuidor,
      });
      await em.persistAndFlush(venta);


      if (!venta.id) {
        throw new Error("No se pudo obtener el ID de la venta");
      }
      // Guardar ID inmediatamente
      ventaId = venta.id;

      // Crear items y descontar stock
      let total = 0;
      for (const item of items) {
        const producto = await em.findOneOrFail(Producto, { id: item.id });
        
        // Descontar stock
        producto.stock -= item.quantity;
        
        const subtotal = producto.precio * item.quantity;
        total += subtotal;

        em.create(ItemVenta, {
          cantidad: item.quantity,
          precio: producto.precio,
          subtotal,
          producto,
          venta,
        });
        
        await em.persist(producto); // Guardar cambio de stock
      }

      // Actualizar total de venta
      venta.total = total;
      
      await em.flush();
    });

    // Crear preferencia MP usando SOLO el ID de la venta
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          title: item.name,
          quantity: Number(item.quantity),
          unit_price: Number(item.precio),
          currency_id: "ARS",
        })),
        back_urls: {
          success: `${process.env.BACK_URL}/api/mercadopago/success`,
          failure: `${process.env.BACK_URL}/api/mercadopago/failure`,
          pending: `${process.env.BACK_URL}/api/mercadopago/pending`,
        },
        external_reference: ventaId.toString(),
        auto_return: "approved",
      },
    });

    res.json({
      success: true,
      id: result.id,
      init_point: result.init_point,
      ventaId,
    });

  } catch (error: any) {
    console.error("Error en createPreference:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};


export const verifyPayment = async (req: Request, res: Response) => {
  const em = orm.em.fork();
  
  const { collection_status, payment_id, external_reference } = req.query;
  const frontendUrl = "https://supermercado-front-js-main.vercel.app";
  const ventaId = external_reference ? parseInt(external_reference as string) : 0;
  
  if (collection_status === "approved") {
    // Aprobado
    const venta = await em.findOne(Venta, { id: ventaId });
    if (venta) {
      venta.estado = "pagada";
      venta.pagoId = payment_id as string;
      await em.flush();
    }
     res.redirect(`${frontendUrl}/payment/success?payment_id=${payment_id}&venta_id=${ventaId}`);
  } else {
    // Rechazado
    const venta = await em.findOne(Venta, { id: ventaId });
    if (venta) {
      const items = await em.find(ItemVenta, { venta: ventaId }, { populate: ['producto'] });
      for (const item of items) {
        item.producto.stock += item.cantidad;
      }
      venta.estado = "cancelada";
      await em.flush();
    }
    const reason = collection_status || 'failed';
    res.redirect(`${frontendUrl}/payment/failure?payment_id=${payment_id}&venta_id=${ventaId}&reason=${reason}`);
  }
};