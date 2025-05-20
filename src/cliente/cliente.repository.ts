import { Cliente } from "./cliente.entity.js"
import { Repository } from "../shared/interfaz/respository.js"
function asignaZona(){}//hacer
//export { asignaZona }
const characters = [
  new Cliente(
    'Tomas',
    'Ramos',
    'tomasRamos@gmail.com',
    '12345',
    'zona1',
    'a02b91bc-3769-4221-beb1-d7a3aeba7dad'
  ),
]

export class ClienteRepository implements Repository<Cliente> {
  public findAll(): Cliente[] | undefined {
    return characters
  }

  public findOne(item: { id: string }): Cliente | undefined {
    return characters.find((character) => character.id === item.id)
  }

  public add(item: Cliente): Cliente | undefined {
    characters.push(item)
    return item
  }

  public update(item: Cliente): Cliente | undefined {
    const characterIdx = characters.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      characters[characterIdx] = { ...characters[characterIdx], ...item }
    }
    return characters[characterIdx]
  }

  public delete(item: { id: string }): Cliente | undefined {
    const characterIdx = characters.findIndex((character) => character.id === item.id)

    if (characterIdx !== -1) {
      const deletedCharacters = characters[characterIdx]
      characters.splice(characterIdx, 1)
      return deletedCharacters
    }
  }
}
