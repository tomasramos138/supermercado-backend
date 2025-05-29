import { Router } from 'express'
import { sanitizeZonaInput, findAll, findOne, add, update, remove } from './zona.controler.js'

export const ZonaRouter = Router()
ZonaRouter.get('/', findAll)
ZonaRouter.get('/:codPostal', findOne)
ZonaRouter.post('/', sanitizeZonaInput, add)
ZonaRouter.put('/:codPostal', sanitizeZonaInput, update)
ZonaRouter.patch('/:codPostal', sanitizeZonaInput, update)
ZonaRouter.delete('/:codPostal', remove)