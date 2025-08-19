/*import { RandomUUIDOptions } from 'node:crypto';
import{ Cliente } from '../cliente/cliente.entity';
import{ Distribuidor } from '../distribuidor/distribuidor.entity';
import{ ItemVenta } from '../item-venta/item.entity';
import crypto from 'node:crypto'
export class Venta {
    constructor(
      public fecha: Date,
      public cliente: Cliente,
      public distribuidor: Distribuidor,
      public itemVenta: ItemVenta[],
      public id=crypto.randomUUID(),
    ) {}
  }
*/

import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
  ManyToOne,
} from '@mikro-orm/core'
import { BaseEntity} from '../shared/baseEntity.entity.js'
import { ItemVenta } from '../item-venta/item.entity.js'
import {Distribuidor} from '../distribuidor/distribuidor.entity.js'
import {Cliente} from '../cliente/cliente.entity.js'

@Entity()
export class Venta extends BaseEntity {

  @OneToMany(() => ItemVenta, (itemVenta) => itemVenta.venta, {
    cascade: [Cascade.ALL],
  })
  itemsVenta = new Collection<ItemVenta>(this)

  @Property({ nullable: false })
  fecha!: Date

  @Property({ nullable: false })
  total!: number

  @ManyToOne(() => Distribuidor, { nullable: false })
  distribuidor!: Distribuidor

  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Distribuidor
}

  /*@Property({ nullable: false })
  total!: number*/ //se puede calcular al momento de mostrar la venta, no es necesario guardarlo