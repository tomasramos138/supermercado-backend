import { Router } from 'express'
import { sanitizeVentaInput, findAll, findOne, add, update, remove, countVentas } from './venta.controler.js'

export const VentaRouter = Router()
VentaRouter.get('/', findAll)
VentaRouter.get('/count', countVentas)
VentaRouter.get('/:id', findOne)
VentaRouter.post('/', sanitizeVentaInput, add)
VentaRouter.put('/:id', sanitizeVentaInput, update)
VentaRouter.patch('/:id', sanitizeVentaInput, update)
VentaRouter.delete('/:id', remove)