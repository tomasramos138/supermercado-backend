import{ Cliente } from '../cliente/cliente.entity';
import{ Distribuidor } from '../distribuidor/distribuidor.entity';
export class Zona {
    constructor(
      public id:number,
      public distribuidores: Distribuidor,
      public clientes: Cliente,
    ) {}
  }