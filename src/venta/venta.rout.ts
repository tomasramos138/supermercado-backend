import { Router } from 'express'
import { sanitizeVentaInput, findAll, findOne, add, update, remove, countVentas, procesarCompra } from './venta.controler.js'

export const VentaRouter = Router()
VentaRouter.get('/', findAll)
VentaRouter.get('/count', countVentas)
VentaRouter.get('/:id', findOne)
VentaRouter.post('/', sanitizeVentaInput, add)
VentaRouter.post('/procesarCompra', procesarCompra)
VentaRouter.put('/:id', sanitizeVentaInput, update)
VentaRouter.patch('/:id', sanitizeVentaInput, update)
VentaRouter.delete('/:id', remove)