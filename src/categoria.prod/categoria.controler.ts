import { Request, Response } from 'express'
import { orm } from '../shared/orm.js'
import { Categoria } from './categoria.entity.js'
import { t } from '@mikro-orm/core'

const em = orm.em

async function findAll(req: Request, res: Response) {
    try {
    const categorias = await em.find(Categoria, {})
    res
      .status(200)
      .json({ message: 'found all categorias', data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const categorias = await em.findOneOrFail(Categoria, { id })
    res
      .status(200)
      .json({ message: 'found categorias de productos', data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const categorias = em.create(Categoria, req.body)
    await em.flush()
    res
      .status(201)
      .json({ message: 'Categoria created', data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const categorias = em.getReference(Categoria, id)
    em.assign(categorias, req.body)
    await em.flush()
    res.status(200).json({ message: 'Categoria updated' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const categorias = em.getReference(Categoria, id)
    await em.removeAndFlush(categorias)
    res.status(200).send({ message: 'Categoria deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {findAll, findOne, add, update, remove }