import { Request, Response, NextFunction } from 'express'
import { DistribuidorRepository} from './distribuidor.reository.js' //asignaZona
import { Distribuidor } from './distribuidor.entity.js'

const repository = new DistribuidorRepository()

function sanitizeDistribuidorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    id: req.body.id,
    name: req.body.name,
    apellido: req.body.apellido,
    valorEntrega: req.body.valorEntrega,
    ventas: req.body.ventas,
    zona: req.body.zona,
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
  const distribuidor = await repository.findOne({ id })
  if (!distribuidor) {
    return res.status(404).send({ message: 'Distribuidor not found' })
  }
  res.json({ data: distribuidor })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const distribuidorInput = new Distribuidor(
    input.id,
    input.name,
    input.apellido,
    input.valorEntrega,
    input.ventas,
    input.zona,
  )

  const character = await repository.add(distribuidorInput)
  return res.status(201).send({ message: 'Distribuidor created', data: character })
}

async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const distribuidor = await repository.update(req.body.sanitizedInput)

  if (!distribuidor) {
    return res.status(404).send({ message: 'Distribuidor not found' })
  }

  return res.status(200).send({ message: 'Distribuidor updated successfully', data: distribuidor })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const distribuidor = await repository.delete({ id })

  if (!distribuidor) {
    res.status(404).send({ message: 'Distribuidor not found' })
  } else {
    res.status(200).send({ message: 'Distribuidor deleted successfully' })
  }
}

export { sanitizeDistribuidorInput, findAll, findOne, add, update, remove }
