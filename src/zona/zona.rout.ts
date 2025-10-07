import { Router } from 'express'
import { sanitizeZonaInput, findAll, findOne, add, update, remove } from './zona.controler.js'

export const ZonaRouter = Router()
ZonaRouter.get('/', findAll)
ZonaRouter.get('/:id', findOne)
ZonaRouter.post('/', sanitizeZonaInput, add)
ZonaRouter.put('/:id', sanitizeZonaInput, update)
ZonaRouter.patch('/:id', sanitizeZonaInput, update)
ZonaRouter.delete('/:id', remove)