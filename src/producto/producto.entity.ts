import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'
import { Categoria } from "../categoria.prod/categoria.entity.js";
//import { ItemVenta } from '../item-venta/item.entity.ignore.js'

  @Entity()
export class Producto extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Property({ nullable: false })
  descripcion!: string

  @ManyToOne(() => Categoria, { nullable: false })
  categoria!: Rel<Categoria>

  @Property({ nullable: false })
  precio!: number

  @Property({ nullable: false })
  imagen!: string //ver que tipo de dato es la imagen

 /* @ManyToMany(() => ItemVenta, (itemsVenta) => itemsVenta.productos, {
    cascade: [Cascade.ALL],
    owner: true,
  })
  itemsVenta = new Collection<ItemVenta>(this)*/
}