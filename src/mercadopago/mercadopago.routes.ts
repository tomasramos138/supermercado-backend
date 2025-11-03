import { Router } from "express";
import { createPreference } from "./mercadopago.controller.js";

const mercadoPagoRouter = Router();

mercadoPagoRouter.post("/create-preference", createPreference);

export { mercadoPagoRouter };
