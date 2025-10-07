import {
  Entity,
  Property,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
  OneToMany,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'
import { Venta } from '../venta/venta.entity.js'
import { Zona } from '../zona/zona.entity.js'

  @Entity()
export class Distribuidor extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Property({ nullable: false })
  apellido!: string

  @Property({ nullable: false })
  dni!: number

  @Property({columnType: 'decimal(10,2)'})
  valorEntrega!: number

  @OneToMany(() => Venta, (venta) => venta.distribuidor, {
    cascade: [Cascade.ALL],
  })
  ventad = new Collection<Venta>(this)

  @ManyToOne(() => Zona, { nullable: true })
  zona!: Rel<Zona>
}
