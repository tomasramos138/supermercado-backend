/*import { Cliente } from "./cliente.entity.js"
import { Repository } from "../shared/interfaz/respository.js"
function asignaZona(){}//hacer
//export { asignaZona }
const clientes = [
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
    return clientes
  }

  public findOne(item: { id: string }): Cliente | undefined {
    return clientes.find((cliente) => cliente.id === item.id)
  }

  public add(item: Cliente): Cliente | undefined {
    clientes.push(item)
    return item
  }

  public update(item: Cliente): Cliente | undefined {
    const clienteIdx = clientes.findIndex((cliente) => cliente.id === item.id)

    if (clienteIdx !== -1) {
      clientes[clienteIdx] = { ...clientes[clienteIdx], ...item }
    }
    return clientes[clienteIdx]
  }

  public delete(item: { id: string }): Cliente | undefined {
    const clienteIdx = clientes.findIndex((cliente) => cliente.id === item.id)

    if (clienteIdx !== -1) {
      const deletedClientes = clientes[clienteIdx]
      clientes.splice(clienteIdx, 1)
      return deletedClientes
    }
  }
}

*/