import crypto from 'node:crypto'
export class Categoria {
  constructor(
    public id = crypto.randomUUID(),
    public name: string,
    public descripcion:string,
  ) {}
}