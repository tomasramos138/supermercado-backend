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

    // Validaciones
    if (!items?.length) return res.status(400).json({ error: "Carrito vacío" });
    if (!clienteId) return res.status(400).json({ error: "Falta cliente" });
    if (!distribuidorId) return res.status(400).json({ error: "Falta distribuidor" });

    let ventaId = 0;
    let costoEntrega = 0;

    await em.transactional(async (em) => {
      // Obtener distribuidor para costo de entrega
      const distribuidor = await em.findOneOrFail(Distribuidor, { id: distribuidorId });
      costoEntrega = distribuidor.valorEntrega;

      // Verificar stock
      for (const item of items) {
        const producto = await em.findOneOrFail(Producto, { id: item.id });
        if (producto.stock < item.quantity) {
          throw new Error(`Sin stock: ${producto.name}`);
        }
      }

      // Crear venta
      const venta = em.create(Venta, {
        fecha: new Date(),
        total: 0,
        estado: "pendiente",
        cliente: await em.findOneOrFail(Cliente, { id: clienteId }),
        distribuidor,
      });
      await em.persistAndFlush(venta);

      if (!venta.id) throw new Error("Error al crear la venta");
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
      }

      // Guardar total
      venta.total = total;
      await em.flush();
    });

    // Crear items para MercadoPago (con costo de entrega)
    const mpItems = [];

    // Agregar productos
    for (const item of items) {
      const producto = await em.findOne(Producto, { id: item.id });
      mpItems.push({
        id: item.id.toString(), // Agregar id requerido
        title: producto?.name || `Producto ${item.id}`,
        quantity: Number(item.quantity),
        unit_price: Number(item.precio),
        currency_id: "ARS",
      });
    }

    // Agregar costo de entrega
    if (costoEntrega > 0) {
      mpItems.push({
        id: "entrega_distribuidor", // Agregar id para el costo de entrega
        title: "Costo de entrega",
        quantity: 1,
        unit_price: Number(costoEntrega),
        currency_id: "ARS",
      });
    }

    // Crear preferencia MP
    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: mpItems,
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
    console.error("Error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};


export const verifyPayment = async (req: Request, res: Response) => {
  const em = orm.em.fork();
  const { payment_id, external_reference } = req.query;
  const frontendUrl = process.env.FRONT_URL as string;

  if (!payment_id) {
    return res.redirect(`${frontendUrl}/payment/failure`);
  }

  const payment = new Payment(client);
  const paymentInfo = await payment.get({
    id: payment_id as string,
  });

  const ventaId = parseInt(external_reference as string);

  const venta = await em.findOne(Venta, { id: ventaId });
  if (!venta) {
    return res.redirect(`${frontendUrl}/payment/failure`);
  }

  if (paymentInfo.status === "approved") {
    venta.estado = "pagada";
    venta.pagoId = payment_id as string;
  } else {
    venta.estado = "cancelada";
  }

  await em.flush();

  res.redirect(`${frontendUrl}/payment/success?venta_id=${ventaId}`);
};