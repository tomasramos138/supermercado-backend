import { Router } from 'express'
import { sanitizeDistribuidorInput, findAll, findOne, add, update, remove, findByZona } from './distribuidor.controler.js'

export const distribuidorRouter = Router()
distribuidorRouter.get('/', findAll)
distribuidorRouter.get('/:id', findOne)
distribuidorRouter.get('/zona/:zonaId', findByZona)
distribuidorRouter.post('/', sanitizeDistribuidorInput, add)
distribuidorRouter.put('/:id', sanitizeDistribuidorInput, update)
distribuidorRouter.patch('/:id', sanitizeDistribuidorInput, update)
distribuidorRouter.delete('/:id', remove)
