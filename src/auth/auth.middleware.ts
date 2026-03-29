/**
 * @module Auth/Middleware
 * @remarks Simplified middleware for role-based authorization.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Token no proporcionado o formato incorrecto' 
    });
  }
  //Extrae el token del header
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verifica el token con la librería jsonwebtoken
    console.log('JWT_SECRET defined:', !!process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    console.log('JWT error:', error);
    return res.status(401).json({ message: 'Token invÃ¡lido o expirado' });
  }
};


export const roleAuthMiddleware = (...allowedRoles: ('admin' | 'usuario')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.rol;

    if (userRole && allowedRoles.includes(userRole)) {
      return next();
    }
    return res.status(403).json({
      status: 'error',
      message: `No tienes permiso. Roles requeridos: ${allowedRoles.join(' o ')}`
    });
  };
};