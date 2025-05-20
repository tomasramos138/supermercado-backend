import{ Cliente } from '../cliente/cliente.entity';
import{ Distribuidor } from '../distribuidor/distribuidor.entity';
import{ ItemVenta } from '../item.venta/item.entity';
export class Venta {
    constructor(
      public fecha: Date,
      public cliente: Cliente,
      public distribuidor: Distribuidor,
      public itemVenta: ItemVenta[],
    ) {}
  }
