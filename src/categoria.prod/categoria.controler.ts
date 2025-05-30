import { Request, Response, NextFunction } from 'express'
import { CategoriaRepository} from './categoria.repository.js' //asignacategoria
import { Categoria } from './categoria.entity.js'

const repository = new CategoriaRepository()

function sanitizeCategoriaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
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
  const categoria = await repository.findOne({ id })
  if (!categoria) {
    return res.status(404).send({ message: 'categoria not found' })
  }
  res.json({ data: categoria })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const categoriaInput = new Categoria(
    input.name,
    input.descripcion,
  )

  const character = await repository.add(categoriaInput)
  return res.status(201).send({ message: 'categoria created', data: character })
}

async function update(req: Request, res: Response) {
  req.body.sanitizedInput.id = req.params.id
  const categoria = await repository.update(req.body.sanitizedInput)

  if (!categoria) {
    return res.status(404).send({ message: 'categoria not found' })
  }

  return res.status(200).send({ message: 'categoria updated successfully', data: categoria })
}

async function remove(req: Request, res: Response) {
  const id = req.params.id
  const categoria = await repository.delete({ id })

  if (!categoria) {
    res.status(404).send({ message: 'categoria not found' })
  } else {
    res.status(200).send({ message: 'categoria deleted successfully' })
  }
}

export { sanitizeCategoriaInput, findAll, findOne, add, update, remove }