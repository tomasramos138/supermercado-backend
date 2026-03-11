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
) => {
  // Get authorization header
  const authHeader = req.headers['authorization'];

  // Check if header exists and has correct format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'Token no proporcionado o formato incorrecto' 
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Attach user info to request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
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