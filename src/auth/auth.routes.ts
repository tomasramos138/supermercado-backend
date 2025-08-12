import { Router } from "express"
import { authController } from "./auth.controller.js"

export const authRouter = Router()

// Rutas públicas
authRouter.post("/register", authController.register)
authRouter.post("/login", authController.login)
