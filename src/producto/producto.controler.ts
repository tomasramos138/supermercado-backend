import { Request, Response, NextFunction } from 'express'
import { ProductoRepository} from './producto.repository.js' //asignaZona
import { Producto } from './producto.entity.js'

const repository = new ProductoRepository()

function sanitizeProductoInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
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
  res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
  const id = req.params.id
  const producto = await repository.findOne({ id })
  if (!producto) {
    return res.status(404).send({ message: 'Producto not found' })
  }
  res.json({ data: producto })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const productoInput = new Producto(
    input.id,
    input.name,
    input.descripcion,
    input.precio,
    input.imagen,
    input.categoria,
  )

  const producto = await repository.add(productoInput)
  return res.status(201).send({ message: 'Producto created', data: producto })
}

async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const producto = await repository.update(req.body.sanitizedInput)

  if (!producto) {
    return res.status(404).send({ message: 'Producto not found' })
  }

  return res.status(200).send({ message: 'Producto updated successfully', data: producto })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const producto = await repository.delete({ id })

  if (!producto) {
    res.status(404).send({ message: 'Producto not found' })
  } else {
    res.status(200).send({ message: 'Producto deleted successfully' })
  }
}

export { sanitizeProductoInput, findAll, findOne, add, update, remove }
