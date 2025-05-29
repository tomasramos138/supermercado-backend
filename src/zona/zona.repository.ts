import { Zona } from "./zona.entity.js"
import { Repository } from "../shared/interfaz/respository.js"                  
import { Cliente } from "../cliente/cliente.entity.js"
function asignaZona(){}//hacer
//export { asignaZona }
const zonas: Zona[] = []

export class ZonaRepository implements Repository<Zona> {
  public findAll(): Zona[] | undefined {
    return zonas
  }

  public findOne(item: { id: string }): Zona | undefined {
    return zonas.find((zona) => zona.id === item.id)
  }

  public add(item: Zona): Zona | undefined {
    zonas.push(item)
    return item
  }

  public update(item: Zona): Zona | undefined {
    const zonaIdx = zonas.findIndex((zona) => zona.id === item.id)

    if (zonaIdx !== -1) {
      zonas[zonaIdx] = { ...zonas[zonaIdx], ...item }
    }
    return zonas[zonaIdx]
  }

  public delete(item: { id: string }): Zona | undefined {
    const zonaIdx = zonas.findIndex((zona) => zona.id === item.id)

    if (zonaIdx !== -1) {
      const deletedZonas = zonas[zonaIdx]
      zonas.splice(zonaIdx, 1)
      return deletedZonas
    }
  }
}