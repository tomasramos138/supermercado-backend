import { Router } from 'express'
import { sanitizeClienteInput, findAll, findOne, add, update, remove, countClientes } from './cliente.controler.js'

export const clienteRouter = Router()
clienteRouter.get('/', findAll)
clienteRouter.get('/count', countClientes)
clienteRouter.get('/login', findOne)
clienteRouter.get('/:id', findOne)
clienteRouter.post('/', sanitizeClienteInput, add)
clienteRouter.put('/:id', sanitizeClienteInput, update)
clienteRouter.patch('/:id', sanitizeClienteInput, update)
clienteRouter.delete('/:id', remove)
