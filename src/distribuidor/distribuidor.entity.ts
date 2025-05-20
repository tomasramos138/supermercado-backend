import{Venta} from '../venta/venta.entity';
import { Zona } from '../zona/zona.entity';
export class Distribuidor {
    constructor(
      public id:number,
      public name: string,
      public apellido: string,
      public valorEntrega:number,
      public ventas:Venta[],
      public zona:Zona,
    ) {}
  }