/*import{pool}from '../shared/interfaz/db/mysql.conn.js';
import crypto from 'node:crypto'
export class Zona {
    constructor(
      public name: string,
      public descripcion: string,
      public id?: number ,//crypto.randomUUID()
    ) {}
  }
*/
import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity} from '../shared/baseEntity.entity.js'
import{Cliente} from '../cliente/cliente.entity.js';
import{Distribuidor} from '../distribuidor/distribuidor.entity.js';

  @Entity()
export class Zona extends BaseEntity {

  @Property({ nullable: false, unique: true })
  name!: string

  @Property()
  description!: string

  @OneToMany(() => Cliente, (cliente) => cliente.zona, {
    cascade: [Cascade.ALL],
  })
  clientes = new Collection<Cliente>(this)

  @OneToMany(() => Distribuidor, (distribuidor) => distribuidor.zona, {
    cascade: [Cascade.ALL],
  })
  distribuidores = new Collection<Distribuidor>(this)
}