import { Router } from 'express'
import { sanitizeCategoriaInput, findAll, findOne, add, update, remove } from './categoria.controler.js'

export const CategoriaRouter = Router()
CategoriaRouter.get('/', findAll)
CategoriaRouter.get('/:id', findOne)
CategoriaRouter.post('/', sanitizeCategoriaInput, add)
CategoriaRouter.put('/:id', sanitizeCategoriaInput, update)
CategoriaRouter.patch('/:id', sanitizeCategoriaInput, update)
CategoriaRouter.delete('/:id', remove)