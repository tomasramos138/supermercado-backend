import { Router } from 'express'
import { sanitizeCategoriaInput, findAll, findOne, add, update, remove } from './categoria.controler.js'

export const ZonaRouter = Router()
ZonaRouter.get('/', findAll)
ZonaRouter.get('/:codPostal', findOne)
ZonaRouter.post('/', sanitizeCategoriaInput, add)
ZonaRouter.put('/:codPostal', sanitizeCategoriaInput, update)
ZonaRouter.patch('/:codPostal', sanitizeCategoriaInput, update)
ZonaRouter.delete('/:codPostal', remove)