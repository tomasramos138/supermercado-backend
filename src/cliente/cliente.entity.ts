//import { Zona } from "../zona/zona.entity";
import crypto from 'node:crypto'
//import { Zona } from '../zona/zona.entity';
export class Cliente {
  constructor(
    public name: string,
    public apellido: string,
    public usuario: string,
    public contraseña: string,
    public zona: string,//cambiar controller
    public id= crypto.randomUUID(),
  ) {}
}