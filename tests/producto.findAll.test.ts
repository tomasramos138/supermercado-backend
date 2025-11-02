import { Request, Response } from 'express';

// Mock del módulo orm (solo para este archivo)
jest.mock('../src/shared/orm.js', () => {
  const em = {
    find: jest.fn(),
  };
  return { orm: { em } };
});

import * as productoController from '../src/producto/producto.controler';
import { orm } from '../src/shared/orm.js';

function makeMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
}

function makeMockRequest(): Request {
  return { } as Request;
}

describe('producto.controller - findAll', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('findAll devuelve productos y status 200', async () => {
    // Arrange
    const mockProducts = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    (orm.em.find as jest.Mock).mockResolvedValue(mockProducts);

    const req = makeMockRequest();
    const res = makeMockResponse();

    // Act
    await productoController.findAll(req, res);

    // Assert
    expect(orm.em.find).toHaveBeenCalledWith(expect.anything(), {}, { populate: ['categoria'] });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'found all productos', data: mockProducts });
  });
});