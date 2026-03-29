import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata'
import express from 'express';
import { orm, syncSchema } from './shared/orm.js';
import { RequestContext } from '@mikro-orm/core';
import cors from 'cors';   
import path from 'path';  
import { productoRouter } from './producto/producto.route.js';
import { CategoriaRouter } from './categoria.prod/categoria.rout.js';
import { clienteRouter } from './cliente/cliente.routes.js';
import { distribuidorRouter } from './distribuidor/distribuidor.rout.js';
import { ZonaRouter } from './zona/zona.rout.js';
import { VentaRouter } from './venta/venta.rout.js';
import { ItemVentaRouter } from './item-venta/item.rout.js';
import { authRouter } from './auth/auth.routes.js';
import { mercadoPagoRouter } from './mercadopago/mercadopago.routes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express()

app.use(cors({
  origin: process.env.FRONT_URL || 'http://localhost:5173',
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH' ,'OPTIONS'],
  credentials: true
}));
app.options('*', cors()); 

app.use(express.json())

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

app.use("/api/auth", authRouter)
app.use('/api/cliente', clienteRouter)
app.use('/api/producto', productoRouter)
app.use('/api/distribuidor', distribuidorRouter)
app.use('/api/zona', ZonaRouter)
app.use('/api/categoria', CategoriaRouter)
app.use('/api/venta', VentaRouter)
app.use('/api/item-venta', ItemVentaRouter)
app.use('/api/mercadopago', mercadoPagoRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

await syncSchema()

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});

export default app
export { app }