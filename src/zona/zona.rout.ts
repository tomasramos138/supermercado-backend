import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js'
import { sanitizeZonaInput, findAll, findOne, add, update, remove, findByNameStart} from './zona.controler.js'

export const ZonaRouter = Router()
ZonaRouter.get('/', findAll)
ZonaRouter.get('/search', authMiddleware, roleAuthMiddleware('admin'), findByNameStart)
ZonaRouter.get('/:id', authMiddleware, findOne)
ZonaRouter.post('/', authMiddleware, roleAuthMiddleware('admin'), sanitizeZonaInput, add)
ZonaRouter.put('/:id', authMiddleware, roleAuthMiddleware('admin'), sanitizeZonaInput, update)
ZonaRouter.patch('/:id', authMiddleware, roleAuthMiddleware('admin'), sanitizeZonaInput, update)
ZonaRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)