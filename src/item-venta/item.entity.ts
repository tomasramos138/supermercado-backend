import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { BaseEntity} from '../shared/baseEntity.entity.js'
import { Producto } from '../producto/producto.entity.js'
import { Venta } from '../venta/venta.entity.js'

  @Entity()
export class ItemVenta extends BaseEntity {

  @Property()
  cantidad!: number

  @ManyToOne(() => Producto, {nullable: false})
  producto!: Rel<Venta>

  @ManyToOne(() => Venta, {nullable: false})
  venta!: Rel<Venta>
}
