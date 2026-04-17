<<<<<<< HEAD
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

=======
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
>>>>>>> 6d6632e2e17a22bae2cf3725bbd7f80e1c4eece0
