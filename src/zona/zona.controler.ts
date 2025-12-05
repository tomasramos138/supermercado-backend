import { Request, Response, NextFunction } from 'express'
import { Zona } from './zona.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeZonaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name:req.body.name,
    description: req.body.description,
    clientes: req.body.clientes,
    distribuidores: req.body.distribuidores,
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
    const zonas = await em.find(
      Zona,
      {},
      { populate: ['distribuidores'] } //si quiero traer los distribuidores asociados a la zona
    )
    res.status(200).json({ message: 'found all zonas', data: zonas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const zona = await em.findOneOrFail(
      Zona,
      { id },
      { populate: ['clientes', 'distribuidores'] } //si quiero traer los clientes y distribuidores asociados a la zona
    )
    res.status(200).json({ message: 'found zona', data: zona })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const zona = em.create(Zona, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'zona created', data: zona })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
 try {
    const id = Number.parseInt(req.params.id)
    const zonaToUpdate = await em.findOneOrFail(Zona, { id })
    em.assign(zonaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'zona updated', data: zonaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  let em = orm.em.fork(); // Usar un EntityManager fork para transacciones
  await em.begin(); // Iniciar transacción

  try {
    const id = Number.parseInt(req.params.id)
    
    // Obtener la zona con TODAS sus relaciones
    const zona = await em.findOne(
      Zona, 
      { id },
      { populate: ['clientes', 'distribuidores'] }
    )
    
    if (!zona) {
      await em.rollback();
      return res.status(404).json({ message: 'Zona no encontrada' })
    }
    
    // Verificar si la zona tiene clientes asociados
    if (zona.clientes.length > 0) {
      await em.rollback();
      return res.status(400).json({ 
        message: 'No se puede eliminar la zona porque tiene clientes asociados',
        data: {
          id: zona.id,
          name: zona.name,
          clientesCount: zona.clientes.length,
          detalles: zona.clientes.getItems().map(c => ({ id: c.id, nombre: c.name || c.name }))
        }
      })
    }
    
    // Si no hay clientes, eliminamos todos los distribuidores primero
    if (zona.distribuidores.length > 0) {
      // OPCIÓN 1: Eliminar uno por uno
      for (const distribuidor of zona.distribuidores) {
        await em.remove(distribuidor);
      }
      
      // OPCIÓN 2: Si quieres eliminarlos en lote (más eficiente)
      // await em.remove(zona.distribuidores.getItems());
      
      console.log(`Eliminados ${zona.distribuidores.length} distribuidores de la zona ${zona.name}`);
    }
    
    // Finalmente eliminamos la zona
    await em.removeAndFlush(zona);
    await em.commit(); // Confirmar transacción
    
    res.status(200).json({ 
      message: 'Zona eliminada correctamente' + 
               (zona.distribuidores.length > 0 ? ` junto con ${zona.distribuidores.length} distribuidores` : ''),
      data: {
        zonaEliminada: {
          id: zona.id,
          name: zona.name
        },
        distribuidoresEliminados: zona.distribuidores.length
      }
    })
    
  } catch (error: any) {
    await em.rollback(); // Revertir en caso de error
    
    // Manejo de errores específicos
    if (error.code === '23503' || error.message.includes('foreign key constraint')) {
      return res.status(400).json({ 
        message: 'Error de integridad referencial. La zona podría tener relaciones activas.',
        error: error.message
      })
    }
    
    res.status(500).json({ 
      message: 'Error al eliminar la zona', 
      error: error.message 
    })
  }
}

async function findByNameStart(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ message: "El parámetro 'q' es requerido" });
    }

    const zonas = await em.find(
      Zona,
      {
        $or: [
          { name: { $like: `${q}%` } },
        ]
      },
      { populate: ['distribuidores'] } 
    );

    res.status(200).json({ 
      message: 'Zonas encontradas', 
      data: zonas 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeZonaInput, findAll, findOne, add, update, remove, findByNameStart }