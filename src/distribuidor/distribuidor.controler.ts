import { Request, Response, NextFunction } from 'express'
import { Distribuidor } from './distribuidor.entity.js'
import {orm} from '../shared/orm.js'

const em = orm.em

function sanitizeDistribuidorInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    apellido: req.body.apellido,
    dni: req.body.dni,
    valorEntrega: req.body.valorEntrega,
    ventad: req.body.ventad,
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
    try {
    const distribuidores = await em.find(
      Distribuidor,
      {},
      { populate: ['zona'] }//si agreco 'ventac' me traerá las ventas asociadas a cada distribuidor
    )
    res.status(200).json({ message: 'found all distribuidor', data: distribuidores })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const distribuidor = await em.findOneOrFail(
      Distribuidor,
      { id },
      { populate: ['zona'] }
    )
    res.status(200).json({ message: 'found distribuidor', data: distribuidor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const distribuidor = em.create(Distribuidor, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'distribuidor created', data: distribuidor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const distribuidorToUpdate = await em.findOneOrFail(Distribuidor, { id })
    em.assign(distribuidorToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'distribuidor update', data: distribuidorToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const distribuidor = em.getReference(Distribuidor, id)
    await em.removeAndFlush(distribuidor)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeDistribuidorInput, findAll, findOne, add, update, remove }