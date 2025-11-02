import { Request, Response } from 'express';

// Mock del módulo orm 
jest.mock('../src/shared/orm.js', () => {
  const em = {
    create: jest.fn(),
    flush: jest.fn(),
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

function makeMockRequest(body?: any): Request {
  return { body: body ?? {} } as Request;
}

describe('producto.controller - add', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('add crea producto y responde 201', async () => {
    // Arrange
    const input = { name: 'Pan', precio: 10 };
    const created = { id: 99, ...input };
    (orm.em.create as jest.Mock).mockReturnValue(created);
    (orm.em.flush as jest.Mock).mockResolvedValue(undefined);

    // Simulamos que el middleware sanitizeProductoInput ya dejó sanitizedInput
    const req = makeMockRequest({ sanitizedInput: input });
    const res = makeMockResponse();

    // Act
    await productoController.add(req, res);

    // Assert
    expect(orm.em.create).toHaveBeenCalledWith(expect.anything(), input);
    expect(orm.em.flush).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'producto created', data: created });
  });
});