import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { createPreference, verifySuccess, verifyFailure } from "./mercadopago.controller.js";

export const mercadoPagoRouter = Router();

mercadoPagoRouter.post("/create-preference", authMiddleware, createPreference);
mercadoPagoRouter.get('/success', verifySuccess);
mercadoPagoRouter.get('/failure', verifyFailure);