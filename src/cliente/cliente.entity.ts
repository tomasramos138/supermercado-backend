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
export class Cliente extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Property({ nullable: false })
  apellido!: string

  @Property({ nullable: false })
  dni!: number

  @Property({ nullable: false })
  usuario!: string

  @Property({ nullable: false })
  contraseña!: string

  @OneToMany(() => Venta, (venta) => venta.cliente, {
    cascade: [Cascade.ALL],
  })
  ventac = new Collection<Venta>(this)

  @ManyToOne(() => Zona, { nullable: true })
  zona!: Rel<Zona>
}
