import { Request, Response, NextFunction } from 'express'
import { ZonaRepository} from './zona.repository.js' //asignaZona
import { Zona } from './zona.entity.js'

const repository = new ZonaRepository()

function sanitizeZonaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name:req.body.name,
    descripcion: req.body.descripcion,
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
  const zona = await repository.findOne({ id })
  if (!zona) {
    return res.status(404).send({ message: 'Zona not found' })
  }
  res.json({ data: zona })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const zonaInput = new Zona(
  input.name,
  input.descripcion,  
  )

  const zona = await repository.add(zonaInput)
  return res.status(201).send({ message: 'Zona created', data: zona })
}

async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const zona = await repository.update(req.body.sanitizedInput)

  if (!zona) {
    return res.status(404).send({ message: 'Zona not found' })
  }

  return res.status(200).send({ message: 'Zona updated successfully', data: zona })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const zona = await repository.delete({ id })

  if (!zona) {
    res.status(404).send({ message: 'Zona not found' })
  } else {
    res.status(200).send({ message: 'Zona deleted successfully' })
  }
}

export { sanitizeZonaInput, findAll, findOne, add, update, remove }

