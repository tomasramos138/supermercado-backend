import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js'
import { sanitizeClienteInput, findAll, findOne, add, update, remove, countClientes, findByNameStart } from './cliente.controler.js'

export const clienteRouter = Router()
clienteRouter.get('/', authMiddleware, roleAuthMiddleware('admin') ,findAll)
clienteRouter.get('/count', authMiddleware, roleAuthMiddleware('admin'), countClientes)
clienteRouter.get('/login', findOne)
clienteRouter.get('/search', authMiddleware, roleAuthMiddleware('admin') ,findByNameStart)
clienteRouter.get('/:id', findOne)
clienteRouter.post('/', sanitizeClienteInput, add)
clienteRouter.put('/:id', authMiddleware, sanitizeClienteInput, update)
clienteRouter.patch('/:id', authMiddleware ,sanitizeClienteInput, update)
clienteRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)