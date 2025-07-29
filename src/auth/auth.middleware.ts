import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-aqui"

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Token de acceso requerido" })
  }

  jwt.verify(token, JWT_SECRET, (err: any, cliente: any) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido" })
    }
    ;(req as any).cliente = cliente
    next()
  })
}
