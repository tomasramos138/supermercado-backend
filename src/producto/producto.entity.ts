import { Categoria } from "../categoria.prod/categoria.entity";
export class Producto {
    constructor(
      public id:number,
      public name: string,
      public descripcion: string,
      public precio: number,
      public imagen: ImageBitmap,//ver que tipo de dato es la imagen
      public categoria: Categoria[],
    ) {}
  }