import { Router } from 'express'
import { sanitizeItemVentaInput, findAll, findOne, add, update, remove } from './item.controler.js'

export const ItemVentaRouter = Router()
ItemVentaRouter.get('/', findAll)
ItemVentaRouter.get('/:id', findOne)
ItemVentaRouter.post('/', sanitizeItemVentaInput, add)
ItemVentaRouter.put('/:id', sanitizeItemVentaInput, update)
ItemVentaRouter.patch('/:id', sanitizeItemVentaInput, update)
ItemVentaRouter.delete('/:id', remove)