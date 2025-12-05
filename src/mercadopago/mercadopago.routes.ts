import { Router } from "express";
import { createPreference, verifyPayment } from "./mercadopago.controller.js";

export const mercadoPagoRouter = Router();

mercadoPagoRouter.post("/create-preference", createPreference);

mercadoPagoRouter.post('/success', verifyPayment);
