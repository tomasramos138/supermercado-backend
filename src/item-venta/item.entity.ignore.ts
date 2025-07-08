import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'
import { Producto } from '../producto/producto.entity.js'


  @Entity()
export class ItemVenta extends BaseEntity {

  @Property()
  cantidad!: number

  /*@ManyToMany(() => Producto, (producto) => producto.itemsVenta)
  productos = new Collection<Producto>(this)*/
}