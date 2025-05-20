//import { Zona } from "../zona/zona.entity";
import crypto from 'node:crypto'
export class Cliente {
  constructor(
    public name: string,
    public apellido: string,
    public usuario: string,
    public contraseña: string,
    public zona:string, //public zona:Zona,
    public id= crypto.randomUUID(),
  ) {}
}