import { Entity, OneToMany, Property, Cascade, Collection, } from '@mikro-orm/core'
import { BaseEntity} from '../shared/baseEntity.entity.js'
import { Producto } from '../producto/producto.entity.js'

@Entity()
export class Categoria extends BaseEntity {

  @Property({ nullable: false, unique: true })
  name!: string

  @Property()
  description!: string

  @OneToMany(() => Producto, (producto) => producto.categoria, {
    cascade: [Cascade.ALL],
  })
  productos = new Collection<Producto>(this)
}