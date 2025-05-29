import{Venta} from '../venta/venta.entity';
import { Zona } from '../zona/zona.entity';
import crypto from 'node:crypto';
export class Distribuidor {
    constructor(
      public id=crypto.randomUUID(),
      public name: string,
      public apellido: string,
      public valorEntrega:number,
      public ventas:Venta[],
      public zona:Zona,
    ) {}
  }