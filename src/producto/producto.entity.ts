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
import { Categoria } from "../categoria.prod/categoria.entity.js";
import { ItemVenta } from '../item-venta/item.entity.js'

  @Entity()
export class Producto extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Property({ nullable: false })
  descripcion!: string

  @ManyToOne(() => Categoria, { nullable: false })
  categoria!: Rel<Categoria>

  @Property({columnType: 'decimal(10,2)'})
  precio!: number

  @Property({ nullable: false })
  stock!: number

  @Property({ nullable: false })
  imagen!: string //ver que tipo de dato es la imagen

  @Property({ nullable: false })
  estado!: boolean 

  @OneToMany(() => ItemVenta, (itemVenta) => itemVenta.producto, {
    cascade: [Cascade.ALL],
  })
  itemsVenta = new Collection<ItemVenta>(this)
}