import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js' 
import { findAll, findOne, add, update, remove, findByNameStart } from './categoria.controler.js'


export const CategoriaRouter = Router()
CategoriaRouter.get('/', authMiddleware, findAll)
CategoriaRouter.get('/search', authMiddleware,roleAuthMiddleware('admin'), findByNameStart)
CategoriaRouter.get('/:id', authMiddleware, findOne)
CategoriaRouter.post('/', authMiddleware,roleAuthMiddleware('admin') ,add)
CategoriaRouter.put('/:id', authMiddleware, roleAuthMiddleware('admin'), update)
CategoriaRouter.patch('/:id', authMiddleware, roleAuthMiddleware('admin'), update)
CategoriaRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)