import { Request, Response, NextFunction } from 'express'
import { ClienteRepository} from './cliente.repository.js' //asignaZona
import { Cliente } from './cliente.entity.js'

const repository = new ClienteRepository()

function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    apellido: req.body.apellido,
    usuario: req.body.usuario,
    contraseña: req.body.contraseña,
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
  const cliente = await repository.findOne({ id })
  if (!cliente) {
    return res.status(404).send({ message: 'Cliente not found' })
  }
  res.json({ data: cliente })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const clienteInput = new Cliente(
    input.name,
    input.apellido,
    input.usuario,
    input.contraseña,
    input.zona,
  )

  const character = await repository.add(clienteInput)
  return res.status(201).send({ message: 'Cliente created', data: character })
}

async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const cliente = await repository.update(req.body.sanitizedInput)

  if (!cliente) {
    return res.status(404).send({ message: 'Cliente not found' })
  }

  return res.status(200).send({ message: 'Cliente updated successfully', data: cliente })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const cliente = await repository.delete({ id })

  if (!cliente) {
    res.status(404).send({ message: 'Cliente not found' })
  } else {
    res.status(200).send({ message: 'Cliente deleted successfully' })
  }
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove }
