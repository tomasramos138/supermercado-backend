import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/orm.js'
import { Producto } from './producto.entity.js'

const em = orm.em

function sanitizeProductoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    stock: req.body.stock,
    imagen: req.body.imagen,
    categoria: req.body.categoria,
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
    const productos = await em.find(
      Producto,
      {},
      { populate: ['categoria'] }
    )
    res.status(200).json({ message: 'found all productos', data: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const producto = await em.findOneOrFail(
      Producto,
      { id },
      { populate: ['categoria'] }
    )
    res.status(200).json({ message: 'found producto', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const producto = em.create(Producto, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'producto created', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
 try {
    const id = Number.parseInt(req.params.id)
    const productoToUpdate = await em.findOneOrFail(Producto, { id })
    em.assign(productoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'producto updated', data: productoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const producto = em.getReference(Producto, id)
    await em.removeAndFlush(producto)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeProductoInput, findAll, findOne, add, update, remove }

