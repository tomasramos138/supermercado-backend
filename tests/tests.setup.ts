// tests/setup.ts
import 'reflect-metadata';

// Configuración global para tests
jest.setTimeout(30000);

// Variables de entorno para testing
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';