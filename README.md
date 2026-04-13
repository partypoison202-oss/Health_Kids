# HealthKids — Integración MySQL

## Estructura de archivos entregados

```
healthkids_db/
  healthkids_schema.sql        <- Script SQL completo

healthkids_backend/
  package.json                 <- Dependencias del backend
  .env.example                 <- Plantilla de variables de entorno
  src/
    server.js                  <- Servidor Express principal
    db.js                      <- Conexion MySQL (pool)
    middleware/
      auth.js                  <- Validacion JWT
    routes/
      auth.js                  <- /register  /login  /me  /perfil

  app_changes/                 <- Archivos modificados para tu app Expo
    services/
      api.ts                   <- Capa de servicios (fetch al backend)
    app/
      index.tsx                <- Login + Registro conectado a la API
```

---

## Paso 1 - Base de datos MySQL

  mysql -u root -p < healthkids_db/healthkids_schema.sql

Esto crea:
- Base de datos "healthkids"
- Tabla usuarios  (credenciales + rol)
- Tabla perfiles  (XP, pasos, nivel, liga)
- Tabla sesiones  (tokens JWT)
- 3 usuarios de prueba (password: Test1234!)

---

## Paso 2 - Backend Node.js

  cd healthkids_backend
  cp .env.example .env       <- edita con tu password MySQL y JWT_SECRET
  npm install
  npm run dev                <- desarrollo con nodemon
  npm start                  <- produccion

Servidor en http://localhost:3000

Endpoints:
  GET   /api/ping              -> health-check
  POST  /api/auth/register     -> crear cuenta
  POST  /api/auth/login        -> iniciar sesion
  GET   /api/auth/me    (JWT)  -> perfil actual
  PUT   /api/auth/perfil (JWT) -> sincronizar XP/pasos

---

## Paso 3 - App Expo

1. Copia app_changes/services/api.ts  ->  services/api.ts en tu proyecto
2. Reemplaza app/index.tsx con app_changes/app/index.tsx
3. Ajusta BASE_URL en services/api.ts:
   - Emulador Android : http://10.0.2.2:3000/api
   - Dispositivo fisico: http://192.168.X.X:3000/api
   - iOS Simulator    : http://localhost:3000/api

---

## Usuarios de prueba

  Admin   / Test1234!  (rol: admin)
  nino01  / Test1234!  (rol: nino)
  padre01 / Test1234!  (rol: padre)

