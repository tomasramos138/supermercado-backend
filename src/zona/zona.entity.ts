import{ Cliente } from '../cliente/cliente.entity';
import{ Distribuidor } from '../distribuidor/distribuidor.entity';
import crypto from 'node:crypto'
export class Zona {
    constructor(
      public name: string,
      public descripcion: string,
      public id= crypto.randomUUID(),
    ) {}
  }

