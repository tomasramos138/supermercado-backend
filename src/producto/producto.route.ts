import { Router } from 'express'
import { roleAuthMiddleware, authMiddleware } from '../auth/auth.middleware.js' 
import { sanitizeProductoInput, findAll, findOne, add, update, remove, countStock, rutaUpload, subirImagenProducto, findByNameStart, findByCategoriaStart} from './producto.controler.js'

export const productoRouter = Router()
productoRouter.get('/', authMiddleware ,findAll)
productoRouter.get('/stockTotal', authMiddleware, roleAuthMiddleware('admin') ,countStock)
productoRouter.get('/searchCat', authMiddleware, findByCategoriaStart)
productoRouter.get('/search', authMiddleware, findByNameStart)
productoRouter.get('/:id', authMiddleware, findOne)
productoRouter.post('/', authMiddleware, roleAuthMiddleware('admin'), sanitizeProductoInput, add)
productoRouter.put('/:id', authMiddleware, roleAuthMiddleware('admin'), sanitizeProductoInput, update)
productoRouter.patch('/:id', authMiddleware, roleAuthMiddleware('admin'), sanitizeProductoInput, update)
productoRouter.delete('/:id', authMiddleware, roleAuthMiddleware('admin'), remove)
productoRouter.post('/imagen',authMiddleware, roleAuthMiddleware('admin'), rutaUpload, subirImagenProducto)