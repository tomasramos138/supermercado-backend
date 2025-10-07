import 'reflect-metadata'
import express from 'express';
import { orm, syncSchema } from './shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
import cors from 'cors' //para que el navegador no bloquee las peticiones
import { productoRouter } from './producto/producto.rout.js';
import { CategoriaRouter } from './categoria.prod/categoria.rout.js';
import { clienteRouter } from './cliente/cliente.routes.js';
import { distribuidorRouter } from './distribuidor/distribuidor.rout.js';
import { ZonaRouter } from './zona/zona.rout.js';
import { VentaRouter } from './venta/venta.rout.js';
import { ItemVentaRouter } from './item-venta/item.rout.js';
import { authRouter } from './auth/auth.routes.js';

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use(cors());

app.use("/api/auth", authRouter)
app.use('/api/cliente', clienteRouter)
app.use('/api/producto', productoRouter)
app.use('/api/distribuidor', distribuidorRouter)
app.use('/api/zona', ZonaRouter)
app.use('/api/categoria', CategoriaRouter)
app.use('/api/venta', VentaRouter)
app.use('/api/item-venta', ItemVentaRouter)
app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema()

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})