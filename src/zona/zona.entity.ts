//import{pool}from '../shared/interfaz/db/mysql.conn.js';
//import crypto from 'node:crypto'
export class Zona {
    constructor(
      public name: string,
      public descripcion: string,
      public id?: number ,//crypto.randomUUID()
    ) {}
  }

