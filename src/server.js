// src/server.js - Punto de entrada de la API HealthKids
require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes = require('./routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────────
app.use(cors());                          // Permite peticiones desde Expo
app.use(express.json());                  // Parsear JSON en el body
app.use(express.urlencoded({ extended: true }));

// ── Rutas ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health-check
app.get('/api/ping', (_req, res) => res.json({ status: 'ok', app: 'HealthKids API' }));

// 404 genérico
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ── Arranque ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 HealthKids API corriendo en http://localhost:${PORT}`);
});
