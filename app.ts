import express from 'express'
import cors from 'cors'
import { clienteRouter } from './src/cliente/cliente.routes.js'
import { productoRouter } from './src/producto/producto.rout.js'
import { distribuidorRouter } from './src/distribuidor/distribuidor.rout.js'
import { ZonaRouter } from './src/zona/zona.rout.js'
import { CategoriaRouter } from './src/categoria.prod/categoria.rout.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/cliente', clienteRouter)
app.use('/api/producto', productoRouter)
app.use('/api/distribuidor', distribuidorRouter)
app.use('/api/zona', ZonaRouter)
app.use('/api/categoria', CategoriaRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})