import { Distribuidor } from "./distribuidor.entity.js"
import { Repository } from "../shared/interfaz/respository.js"
function asignaZona(){}//hacer
//export { asignaZona }
const characters = [
  new Distribuidor(
    
  ),
]

export class DistribuidorRepository implements Repository<Distribuidor> {
  public findAll(): Distribuidor[] | undefined {
    return characters
  }

  public findOne(item: { id: string }): Distribuidor | undefined {
    return characters.find((character) => character.id === item.id)
  }

  public add(item: Distribuidor): Distribuidor | undefined {
    characters.push(item)
    return item
  }

  public update(item: Distribuidor): Distribuidor | undefined {
    const characterIdx = characters.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      characters[characterIdx] = { ...characters[characterIdx], ...item }
    }
    return characters[characterIdx]
  }

  public delete(item: { id: string }): Distribuidor | undefined {
    const characterIdx = characters.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      const deletedCharacters = characters[characterIdx]
      characters.splice(characterIdx, 1)
      return deletedCharacters
    }
  }
}
