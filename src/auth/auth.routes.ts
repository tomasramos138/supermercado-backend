import { Router } from "express"
import { authController } from "./auth.controller.js"
import { authenticateToken } from "./auth.middleware.js"

export const authRouter = Router()

// Rutas públicas
authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)

// Rutas protegidas
authRouter.get("/perfil", authenticateToken, authController.perfil)