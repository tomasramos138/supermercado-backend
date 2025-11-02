import { Request, Response } from 'express'

// Mockeamos el módulo shared/orm antes de importar el controller para evitar ejecutar el top-level await
jest.mock('../src/shared/orm.ts', () => ({
  orm: {
    em: {
      execute: jest.fn()
    }
  }
}))

import * as productoController from '../src/producto/producto.controler'
import { orm } from '../src/shared/orm.js';

function makeMockResponse() {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res as Response
}

function makeMockRequest(query?: any): Request {
  return { query: query ?? {} } as unknown as Request
}

describe('producto.controller - countStock', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('countStock devuelve total stock y status 200', async () => {
    // Arrange: mockeamos el resultado de execute
    ;(orm.em.execute as jest.Mock).mockResolvedValue([{ totalStock: 123 }])

    const req = makeMockRequest()
    const res = makeMockResponse()

    // Act
    await productoController.countStock(req, res)

    // Assert
    expect(orm.em.execute).toHaveBeenCalledWith('SELECT SUM(stock) as totalStock FROM producto')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'total stock', data: 123 })
  })

  test('countStock cuando execute devuelve undefined -> devuelve 0', async () => {
    ;(orm.em.execute as jest.Mock).mockResolvedValue([{}])

    const req = makeMockRequest()
    const res = makeMockResponse()

    await productoController.countStock(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'total stock', data: 0 })
  })

  test('countStock maneja error y responde 500', async () => {
    ;(orm.em.execute as jest.Mock).mockRejectedValue(new Error('DB error'))

    const req = makeMockRequest()
    const res = makeMockResponse()

    await productoController.countStock(req, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ message: 'DB error' })
  })
})