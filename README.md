# Back-End 

## Requisitos
- Node.js (v18 o superior)
- pnpm (v10.9.0 o superior)


---

## ⚙️ Configuración

### Clonar el repositorio

```bash
git clone https://github.com/tomasramos138/supermercado-backend
cd supermercado-backend
```

---

### Instalar dependencias

```bash
pnpm install
```

---

### Crear archivo `.env`

Crear un archivo `.env` en el directorio raíz con las siguientes variables:

```env
# JWT
JWT_SECRET=tu_secreto_jwt

# Mercado Pago
MP_ACCESS_TOKEN=tu_token_acceso_mercadopago

# URL Frontend
FRONT_URL=http://localhost:5173

# URL Backend
LOCALTUNNEL_BACKEND_URL=http://localhost:3000

# URL Database
DATABASE_URL=tu_connection_string
```

---

## 🚀 Ejecutar el Servidor

### Modo desarrollo

```bash
pnpm start:dev
```

### Compilación para producción

```bash
pnpm build
pnpm start:prod
```

El servidor iniciará en:

http://localhost:3000

---


## 📜 Scripts Disponibles

- `pnpm start:dev` → Iniciar servidor con recarga automática
- `pnpm start:prod` → Iniciar servidor de producción
- `pnpm build` → Compilar TypeScript a JavaScript
- `pnpm test` → Ejecutar todas las pruebas
- `pnpm test:coverage` → Ejecutar pruebas con reporte de cobertura
