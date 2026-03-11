import { Router } from "express";
import { authMiddleware, roleAuthMiddleware } from "../auth/auth.middleware.js";
import { createPreference, verifyPayment } from "./mercadopago.controller.js";

export const mercadoPagoRouter = Router();

mercadoPagoRouter.post("/create-preference", authMiddleware, createPreference);

mercadoPagoRouter.get('/success', verifyPayment);