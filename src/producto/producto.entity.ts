import { Categoria } from "../categoria.prod/categoria.entity";
import crypto from 'node:crypto'
export class Producto {
    constructor(
      public id= crypto.randomUUID(),
      public name: string,
      public descripcion: string,
      public precio: number,
      public imagen: ImageBitmap,//ver que tipo de dato es la imagen
      public categoria: Categoria[] ,
    ) {}
  }