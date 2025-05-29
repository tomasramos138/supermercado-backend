import { Producto } from "./producto.entity.js"
import { Repository } from "../shared/interfaz/respository.js"
function asignaZona(){}//hacer
//export { asignaZona }
const characters = [
  new Producto(
  ),
]

export class ProductoRepository implements Repository<Producto> {
  public findAll(): Producto[] | undefined {
    return characters
  }

  public findOne(item: { id: string }): Producto | undefined {
    return characters.find((character) => character.id === item.id)
  }

  public add(item: Producto): Producto | undefined {
    characters.push(item)
    return item
  }

  public update(item: Producto): Producto | undefined {
    const characterIdx = characters.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      characters[characterIdx] = { ...characters[characterIdx], ...item }
    }
    return characters[characterIdx]
  }

  public delete(item: { id: string }): Producto | undefined {
    const characterIdx = characters.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      const deletedCharacters = characters[characterIdx]
      characters.splice(characterIdx, 1)
      return deletedCharacters
    }
  }
}
