import type { Request, Response } from "express"
import { orm } from "../shared/orm.js"
import { Cliente } from "../cliente/cliente.entity.js"
import { Zona } from "../zona/zona.entity.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const em = orm.em

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-aqui"

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, apellido, dni, usuario, contraseña, zonaId } = req.body 

      // Validar que los campos requeridos estén presentes
      if (!name || !apellido || !dni || !usuario || !contraseña|| !zonaId) {
        return res.status(400).json({
          message: "Nombre, apellido, DNI, usuario y contraseña son requeridos",
        })
      }

      // Verificar si la zona existe
      console.log("Verificando zona:", zonaId)
      const zona = await em.findOne(Zona, { id: zonaId })
      if (!zona) {
        console.log("Zona no encontrada")
        return res.status(400).json({
          message: "La zona seleccionada no existe",
        })
      }
      console.log("Zona encontrada:", zona.name)

      // Verificar si el usuario ya existe
      const clienteExistente = await em.findOne(Cliente, { usuario })//ver si estas funciones van en cliente
      if (clienteExistente) {
        return res.status(400).json({
          message: "El usuario ya existe",
        })
      }

      // Verificar si el DNI ya existe
      const dniExistente = await em.findOne(Cliente, { dni })
      if (dniExistente) {
        return res.status(400).json({
          message: "El DNI ya está registrado",
        })
      }

      // Encriptar la contraseña
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(contraseña, saltRounds) 

      // Crear nuevo cliente
      const nuevoCliente = new Cliente()
      nuevoCliente.name = name
      nuevoCliente.apellido = apellido
      nuevoCliente.dni = dni
      nuevoCliente.usuario = usuario
      nuevoCliente.contraseña = hashedPassword 
      nuevoCliente.zona = zona

      await em.persistAndFlush(nuevoCliente)

      // Generar token JWT
      const token = jwt.sign(
        {
          id: nuevoCliente.id,
          usuario: nuevoCliente.usuario,
          name: nuevoCliente.name,
          apellido: nuevoCliente.apellido,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

 res.status(201).json({
        message: "Cliente registrado exitosamente",
        token,
        cliente: {
          id: nuevoCliente.id,
          name: nuevoCliente.name,
          apellido: nuevoCliente.apellido,
          usuario: nuevoCliente.usuario,
          dni: nuevoCliente.dni,
          zona: {
            id: zona.id,
            name: zona.name,
            description: zona.description,
          },
        },
      })
    } catch (error) {
      console.error("Error en registro:", error)
      res.status(500).json({ message: "Error interno del servidor" })
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { usuario, contraseña } = req.body 

      console.log("Datos recibidos:", { usuario, contraseña }) 

      // Validar campos requeridos
      if (!usuario || !contraseña) {
        return res.status(400).json({
          message: "Usuario y contraseña son requeridos",
        })
      }

      // Buscar cliente por usuario
      const cliente = await em.findOne(Cliente, { usuario })
      console.log("Cliente encontrado:", cliente ? "Sí" : "No") 

      if (!cliente) {
        return res.status(401).json({
          message: "Credenciales inválidas",
        })
      }

      // Verificar contraseña
      const passwordValida = await bcrypt.compare(contraseña, cliente.contraseña)
      console.log("Contraseña válida:", passwordValida) 
      if (!passwordValida) {
        return res.status(401).json({
          message: "Credenciales inválidas",
        })
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: cliente.id,
          usuario: cliente.usuario,
          name: cliente.name,
          apellido: cliente.apellido,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      )

      res.json({
        message: "Login exitoso",
        token,
        cliente: {
          id: cliente.id,
          name: cliente.name,
          apellido: cliente.apellido,
          usuario: cliente.usuario,
          dni: cliente.dni,
          zona: cliente.zona
            ? {
                id: cliente.zona.id,
                name: cliente.zona.name,
                description: cliente.zona.description,
              }
            : null,
        },
      })
    } catch (error) {
      console.error("Error en login:", error)
      res.status(500).json({ message: "Error interno del servidor" })
    }
  }

  async perfil(req: Request, res: Response) {
    try {
      const clienteId = (req as any).cliente.id

      const cliente = await em.findOne(Cliente, { id: clienteId }, { populate: ["zona"] })
      if (!cliente) {
        return res.status(404).json({ message: "Cliente no encontrado" })
      }

      res.json({
        cliente: {
          id: cliente.id,
          name: cliente.name,
          apellido: cliente.apellido,
          usuario: cliente.usuario,
          dni: cliente.dni,
          zona: cliente.zona
            ? {
                id: cliente.zona.id,
                name: cliente.zona.name,
                description: cliente.zona.description,
              }
            : null,
        },
      })
    } catch (error) {
      console.error("Error obteniendo perfil:", error)
      res.status(500).json({ message: "Error interno del servidor" })
    }
  }
}

export const authController = new AuthController()