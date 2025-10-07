​​import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './categoria.controler.js'


export const CategoriaRouter = Router()
CategoriaRouter.get('/', findAll)
CategoriaRouter.get('/:id', findOne)
CategoriaRouter.post('/', add)
CategoriaRouter.put('/:id', update)
CategoriaRouter.patch('/:id', update)
CategoriaRouter.delete('/:id', remove)