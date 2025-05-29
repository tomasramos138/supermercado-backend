import { Producto } from "./producto.entity.js"
import { Repository } from "../shared/interfaz/respository.js"
function asignaZona(){}//hacer
//export { asignaZona }
const productos: Producto[] = []

export class ProductoRepository implements Repository<Producto> {
  public findAll(): Producto[] | undefined {
    return productos
  }

  public findOne(item: { id: string }): Producto | undefined {
    return productos.find((producto) => producto.id === item.id)
  }

  public add(item: Producto): Producto | undefined {
    productos.push(item)
    return item
  }

  public update(item: Producto): Producto | undefined {
    const productoIdx = productos.findIndex((producto) => producto.id === item.id)

    if (productoIdx !== -1) {
      productos[productoIdx] = { ...productos[productoIdx], ...item }
    }
    return productos[productoIdx]
  }

  public delete(item: { id: string }): Producto | undefined {
    const productoIdx = productos.findIndex((producto) => producto.id === item.id)

    if (productoIdx !== -1) {
      const deletedProductos = productos[productoIdx]
      productos.splice(productoIdx, 1)
      return deletedProductos
    }
  }
}
