import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js'
import { sanitizeDistribuidorInput, findAll, findOne, add, update, remove, findByZona } from './distribuidor.controler.js'

export const distribuidorRouter = Router()
distribuidorRouter.get('/', authMiddleware, roleAuthMiddleware('admin'), findAll)
distribuidorRouter.get('/:id', findOne)
distribuidorRouter.get('/zona/:zonaId', findByZona)
distribuidorRouter.post('/', authMiddleware, roleAuthMiddleware('admin'), sanitizeDistribuidorInput, add)
distribuidorRouter.put('/:id', authMiddleware, roleAuthMiddleware('admin'), sanitizeDistribuidorInput, update)
distribuidorRouter.patch('/:id', authMiddleware, roleAuthMiddleware('admin'), sanitizeDistribuidorInput, update)
distribuidorRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)