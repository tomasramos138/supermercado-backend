import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js'
import { sanitizeItemVentaInput, findAll, findOne, add, update, remove } from './item.controler.js'

export const ItemVentaRouter = Router()
ItemVentaRouter.get('/', authMiddleware, findAll)
ItemVentaRouter.get('/:id', authMiddleware, findOne)
ItemVentaRouter.post('/', authMiddleware, sanitizeItemVentaInput, add)
ItemVentaRouter.put('/:id', authMiddleware, sanitizeItemVentaInput, update)
ItemVentaRouter.patch('/:id', authMiddleware, sanitizeItemVentaInput, update)
ItemVentaRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)