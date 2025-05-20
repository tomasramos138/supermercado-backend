import{Producto}from "../producto/producto.entity";
export class ItemVenta {
    constructor(
      public cantidad:number,
      public producto: Producto,
    ) {}
  }