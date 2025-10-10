import { Entity, OneToMany, Property, Cascade, Collection, ManyToOne,} from '@mikro-orm/core'
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

  @Property({ columnType: 'decimal(10,2)' })
  total!: number

  @ManyToOne(() => Distribuidor, { nullable: false })
  distribuidor!: Distribuidor

  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Distribuidor
}