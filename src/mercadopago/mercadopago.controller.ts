import { MercadoPagoConfig, Preference } from "mercadopago";
import { Request, Response } from "express";
import "dotenv/config";

// Crear una configuración global
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export const createPreference = async (req: Request, res: Response) => {
  try {
    const items = req.body.items;

    console.log("Items recibidos:", items);

    // Crear instancia de Preference
    const preference = new Preference(client);

    // Crear preferencia de pago
    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.price,
        })),
        back_urls: {
          success: "http://localhost:5173/success",
          failure: "http://localhost:5173/failure",
          pending: "http://localhost:5173/pending",
        },
      //  auto_return: "approved",
      },
    });

    return res.status(200).json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error: any) {
    console.error("Error creando preferencia:", error);
    return res
      .status(500)
      .json({ error: error.message || "Error interno al crear la preferencia" });
  }
};
