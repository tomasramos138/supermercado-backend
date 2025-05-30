import crypto from 'node:crypto'
export class Categoria {
  constructor(
    public name: string,
    public descripcion:string,
    public id = crypto.randomUUID(),
  ) {}
}