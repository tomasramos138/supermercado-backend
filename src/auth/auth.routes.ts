import { Router } from "express"
import { authController } from "./auth.controller.js"

export const authRouter = Router()

// Ambas son rutas publicas (Acceso para clientes sin Registro)
authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)
