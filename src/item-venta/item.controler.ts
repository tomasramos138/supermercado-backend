import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/orm.js'
import { ItemVenta} from '../item-venta/item.entity.js'

const em = orm.em

function sanitizeItemVentaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    cantidad: req.body.cantidad,
    producto: req.body.producto,
    venta: req.body.venta,
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
    const itemsVenta = await em.find(
      ItemVenta,
      {},
      { populate: ['venta','producto'] }
    )
    res.status(200).json({ message: 'found all itemsVenta', data: itemsVenta })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const itemVenta = await em.findOneOrFail(
      ItemVenta,
      { id },
      { populate: ['venta','producto'] }
    )
    res.status(200).json({ message: 'found itemVenta', data: itemVenta })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const itemVenta = em.create(ItemVenta, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'ItemVenta created', data: itemVenta })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
 try {
    const id = Number.parseInt(req.params.id)
    const itemVentaToUpdate = await em.findOneOrFail(ItemVenta, { id })
    em.assign(itemVentaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'itemVenta updated', data: itemVentaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const itemVenta = em.getReference(ItemVenta, id)
    await em.removeAndFlush(itemVenta)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeItemVentaInput, findAll, findOne, add, update, remove }

