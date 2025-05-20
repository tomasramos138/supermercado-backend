import express from 'express'
import cors from 'cors'
import { clienteRouter } from './src/cliente/cliente.routes.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/api/cliente', clienteRouter)

app.use((_, res) => {
  return res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})
