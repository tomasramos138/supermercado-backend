import{ Cliente } from '../cliente/cliente.entity';
import{ Distribuidor } from '../distribuidor/distribuidor.entity';
import crypto from 'node:crypto'
export class Zona {
    constructor(
      public id= crypto.randomUUID(),
      public distribuidores: string, //Distribuidor,
      public clientes: Cliente[],
    ) {}
  }

