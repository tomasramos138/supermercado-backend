import { Request, Response, NextFunction } from 'express'
import { Venta } from './venta.entity.js'
import { orm } from '../shared/orm.js'
import { Producto } from '../producto/producto.entity.js'

const em = orm.em

function sanitizeVentaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
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
      { populate: ['cliente', 'distribuidor', 'itemsVenta', 'itemsVenta.producto'] }//trae el cliente, distribuidor y los items de la venta
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

async function verificarStock(req: Request, res: Response) {
  try {
    const items: { productoId: number; cantidad: number }[] = req.body.items

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "El formato de 'items' es inválido." })
    }

    for (const item of items) {
      const producto = await em.findOne(Producto, { id: item.productoId })

      if (!producto) {
        return res.status(404).json({ message: `Producto con ID ${item.productoId} no encontrado.` })
      }

      if (producto.stock < item.cantidad) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto: ${producto.name}. Disponible: ${producto.stock}, Solicitado: ${item.cantidad}`,
        })
      }
    }

    res.status(200).json({ message: 'Stock disponible para todos los productos.' })
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

export { sanitizeVentaInput, findAll, findOne, add, update, remove, countVentas, verificarStock }
