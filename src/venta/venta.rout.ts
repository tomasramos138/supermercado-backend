import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js'
import { sanitizeVentaInput, findAll, findOne, add, update, remove, countVentas, procesarCompra } from './venta.controler.js'

export const VentaRouter = Router()
VentaRouter.get('/', authMiddleware, roleAuthMiddleware('admin'), findAll)
VentaRouter.get('/count', authMiddleware, roleAuthMiddleware('admin'), countVentas)
VentaRouter.get('/:id', authMiddleware, findOne)
VentaRouter.post('/', authMiddleware, sanitizeVentaInput, add)
VentaRouter.post('/procesarCompra', authMiddleware, procesarCompra)
VentaRouter.put('/:id', authMiddleware, sanitizeVentaInput, update)
VentaRouter.patch('/:id', authMiddleware, sanitizeVentaInput, update)
VentaRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)