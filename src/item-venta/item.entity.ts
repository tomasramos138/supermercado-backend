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

  @Property({nullable: false })
  precio!: number;

  @Property({ nullable: false })
  subtotal!: number

  @ManyToOne(() => Producto, {nullable: false})
  producto!: Rel<Producto>

  @ManyToOne(() => Venta, {nullable: false})
  venta!: Rel<Venta>
}
