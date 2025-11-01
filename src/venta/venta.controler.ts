import { Request, Response, NextFunction } from 'express'
import { Venta } from './venta.entity.js'
import { ItemVenta } from '../item-venta/item.entity.js'
import { orm } from '../shared/orm.js'
import { Producto } from '../producto/producto.entity.js'

const em = orm.em

function sanitizeVentaInput( req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    fecha: req.body.fecha,
    total: req.body.total,
    itemsVenta: req.body.itemsVenta,
    distribuidor: req.body.distribuidor,
    cliente: req.body.cliente,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const ventas = await em.find(
      Venta,
      {},
      { populate: ['cliente', 'distribuidor', 'itemsVenta', 'itemsVenta.producto', 'cliente.zona' ] }//trae el cliente, distribuidor y los items de la venta
    )
    res.status(200).json({ message: 'found all ventas', data: ventas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const venta = await em.findOneOrFail(
      Venta,
      { id },
      { populate: ['cliente', 'distribuidor', 'itemsVenta'] }//trae el cliente, distribuidor y los items de la venta
    )
    res.status(200).json({ message: 'found Venta', data: venta })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const venta = em.create(Venta, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'venta created', data: venta })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const ventaToUpdate = await em.findOneOrFail(Venta, { id })
    em.assign(ventaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'venta updated', data: ventaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const venta = em.getReference(Venta, id)
    await em.removeAndFlush(venta)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function countVentas(req: Request, res: Response) {
  try {
    const totalVentas = await em.count(Venta);
    res.status(200).json({
      message: 'total ventas',
      data: totalVentas
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function procesarCompra(req: Request, res: Response) {
  try {
    const { items, cliente, distribuidor } = req.body;

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "El array 'items' es requerido y no puede estar vacío." });
    }

    if (!cliente) {
      return res.status(400).json({ message: "El campo 'cliente' es requerido." });
    }

    const resultado = await em.transactional(async (em) => {
      // 1) Verificar stock para todos los productos
      for (const item of items) {
        const producto = await em.findOne(Producto, { id: item.productoId });

        if (!producto) {
          throw new Error(`Producto con ID ${item.productoId} no encontrado.`);
        }

        if (producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto: ${producto.name}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`);
        }
      }

      // 2) Crear la venta
      const venta = em.create(Venta, {
        fecha: new Date(),
        total: 0, // Se calculará después
        cliente: cliente,
        distribuidor: distribuidor || null,
      });

      await em.persistAndFlush(venta);

      let totalFinal = 0;

      // 3) Crear items de venta y actualizar stock
      for (const item of items) {
        const producto = await em.findOneOrFail(Producto, { id: item.productoId });
        
        // Actualizar stock
        producto.stock -= item.cantidad;
        
        // Calcular subtotal
        const subtotal = producto.precio * item.cantidad;
        totalFinal += subtotal;

        // Crear item de venta
        const itemVenta = em.create(ItemVenta, {
          cantidad: item.cantidad,
          precio: producto.precio,
          subtotal: subtotal,
          producto: producto,
          venta: venta,
        });

        await em.persist(itemVenta);
      }

      // 4) Actualizar el total de la venta
      venta.total = totalFinal;
      await em.persistAndFlush(venta);

      return {
        ventaId: venta.id,
        totalFinal,
        message: 'Compra procesada exitosamente'
      };
    });

    res.status(201).json({
      message: 'Compra procesada exitosamente',
      data: resultado
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeVentaInput, findAll, findOne, add, update, remove, countVentas, procesarCompra}
