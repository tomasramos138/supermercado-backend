import { Distribuidor } from "../distribuidor/distribuidor.entity";
import { Producto } from "../producto/producto.entity";
import { Cliente } from "../cliente/cliente.entity";
import { Zona } from "../zona/zona.entity";
import { Venta } from "../venta/venta.entity";

export class Supermercado {
  constructor(
    public productos:Producto[],
    public distribuidores: Distribuidor[],
    public cliente: Cliente[],
    public usuario: string,
    public zonas:Zona[],
    public ventas: Venta[],
  ) {}
}