import { Distribuidor } from "./distribuidor.entity.js"
import { Repository } from "../shared/interfaz/respository.js"
function asignaZona(){}//hacer
//export { asignaZona }
const distribuidores: Distribuidor[]= []

export class DistribuidorRepository implements Repository<Distribuidor> {
  public findAll(): Distribuidor[] | undefined {
    return distribuidores
  }

  public findOne(item: { id: string }): Distribuidor | undefined {
    return distribuidores.find((distribuidor) => distribuidor.id === item.id)
  }

  public add(item: Distribuidor): Distribuidor | undefined {
    distribuidores.push(item)
    return item
  }

  public update(item: Distribuidor): Distribuidor | undefined {
    const distribuidorIdx = distribuidores.findIndex((distribuidor) => distribuidor.id === item.id)

    if (distribuidorIdx !== -1) {
      distribuidores[distribuidorIdx] = { ...distribuidores[distribuidorIdx], ...item }
    }
    return distribuidores[distribuidorIdx]
  }

  public delete(item: { id: string }): Distribuidor | undefined {
    const distribuidorIdx = distribuidores.findIndex((distribuidor) => distribuidor.id === item.id)

    if (distribuidorIdx !== -1) {
      const deletedCharacters = distribuidores[distribuidorIdx]
      distribuidores.splice(distribuidorIdx, 1)
      return deletedCharacters
    }
  }
}
