import { Request, Response, NextFunction } from 'express'
import { Cliente } from './cliente.entity.js'
import {orm} from '../shared/orm.js'
import bycrypt from 'bcrypt'

const em = orm.em

function sanitizeClienteInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    apellido: req.body.apellido,
    dni: req.body.dni,
    usuario: req.body.usuario,
    contraseña: req.body.contraseña,
    rol: req.body.rol, 
    ventac: req.body.ventac,
    zona: req.body.zona,
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
    try {
    const clientes = await em.find(
      Cliente,
      {},
      { populate: ['zona'] }//si agreco 'ventac' me traerá las ventas asociadas a cada cliente
    )
    res.status(200).json({ message: 'found all clientes', data: clientes })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.findOneOrFail(
      Cliente,
      { id },
      { populate: ['zona'] }
    )
    res.status(200).json({ message: 'found cliente', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const cliente = em.create(Cliente, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'cliente created', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const clienteToUpdate = await em.findOneOrFail(Cliente, { id });

    // se encripta la nueva contraseña
    if (req.body.sanitizedInput.contraseña) {
      const hashedPassword = await bycrypt.hash(req.body.sanitizedInput.contraseña, 10);
      req.body.sanitizedInput.contraseña = hashedPassword;
    }

    em.assign(clienteToUpdate, req.body.sanitizedInput);
    await em.flush();

    res.status(200).json({ message: 'cliente update', data: clienteToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = em.getReference(Cliente, id)
    await em.removeAndFlush(cliente)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function countClientes(req: Request, res: Response) {
  try {
    const totalClientes = await em.count(Cliente);
    res.status(200).json({
      message: 'total clientes',
      data: totalClientes
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findByNameStart(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "El parámetro 'q' es requerido" });
    }

    const clientes = await em.find(
      Cliente,
      {
        $or: [
          { name: { $like: `${q}%` } },  
          { apellido: { $like: `${q}%` } },
          { usuario: { $like: `${q}%` } }
        ]
      },
      { populate: ['zona'] }
    );

    res.status(200).json({ 
      message: 'Clientes encontrados por nombre o apellido', 
      data: clientes 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove, countClientes, findByNameStart}