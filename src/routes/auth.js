// src/routes/auth.js - Registro, Login y perfil propio
const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const authMw   = require('../middleware/auth');

const router = express.Router();
const SALT_ROUNDS = 10;

// ── Helpers ──────────────────────────────────────────────────

function calcularLiga(nivel) {
  if (nivel >= 20) return 'Leyenda';
  if (nivel >= 15) return 'Campeon';
  if (nivel >= 10) return 'Aventurero';
  if (nivel >= 5)  return 'Explorador';
  return 'Novato';
}

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, username: usuario.username, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── POST /api/auth/register ───────────────────────────────────
router.post('/register', async (req, res) => {
  const { username, email, password, nombre, apellido, fecha_nac, rol } = req.body;

  // Validaciones básicas
  if (!username || !email || !password || !nombre) {
    return res.status(400).json({ error: 'username, email, password y nombre son obligatorios' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Verificar duplicados
    const [existing] = await db.execute(
      'SELECT id FROM usuarios WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'El email o username ya están en uso' });
    }

    // Hash de contraseña
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insertar usuario
    const [result] = await db.execute(
      `INSERT INTO usuarios (username, email, password_hash, nombre, apellido, fecha_nac, rol)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        email,
        password_hash,
        nombre,
        apellido  || null,
        fecha_nac || null,
        ['admin','nino','padre'].includes(rol) ? rol : 'nino'
      ]
    );

    const newUserId = result.insertId;

    // Crear perfil vacío automáticamente
    await db.execute(
      'INSERT INTO perfiles (usuario_id) VALUES (?)',
      [newUserId]
    );

    // Devolver token ya
    const token = generarToken({ id: newUserId, username, rol: rol || 'nino' });

    return res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      usuario: { id: newUserId, username, email, nombre, rol: rol || 'nino' }
    });

  } catch (err) {
    console.error('Error en /register:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'username y password son obligatorios' });
  }

  try {
    // Buscar por username o por email (flexible)
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE (username = ? OR email = ?) AND activo = 1',
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const usuario = rows[0];
    const match   = await bcrypt.compare(password, usuario.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    const token = generarToken(usuario);

    return res.json({
      message: 'Login exitoso',
      token,
      usuario: {
        id:       usuario.id,
        username: usuario.username,
        email:    usuario.email,
        nombre:   usuario.nombre,
        apellido: usuario.apellido,
        rol:      usuario.rol,
      }
    });

  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────
// Retorna usuario + perfil del token actual
router.get('/me', authMw, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT u.id, u.username, u.email, u.nombre, u.apellido, u.rol, u.avatar_url,
              p.nivel, p.xp_actual, p.xp_total, p.pasos_hoy, p.pasos_total,
              p.minutos_activos, p.liga
       FROM usuarios u
       LEFT JOIN perfiles p ON p.usuario_id = u.id
       WHERE u.id = ? AND u.activo = 1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.json({ usuario: rows[0] });

  } catch (err) {
    console.error('Error en /me:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ── PUT /api/auth/perfil ──────────────────────────────────────
// Actualiza XP, pasos, nivel desde la app
router.put('/perfil', authMw, async (req, res) => {
  const { xp_actual, xp_total, pasos_hoy, pasos_total, nivel, minutos_activos } = req.body;

  try {
    const liga = calcularLiga(nivel || 1);

    await db.execute(
      `UPDATE perfiles
       SET xp_actual = COALESCE(?, xp_actual),
           xp_total  = COALESCE(?, xp_total),
           pasos_hoy = COALESCE(?, pasos_hoy),
           pasos_total = COALESCE(?, pasos_total),
           nivel     = COALESCE(?, nivel),
           minutos_activos = COALESCE(?, minutos_activos),
           liga      = ?
       WHERE usuario_id = ?`,
      [
        xp_actual ?? null,
        xp_total  ?? null,
        pasos_hoy ?? null,
        pasos_total ?? null,
        nivel     ?? null,
        minutos_activos ?? null,
        liga,
        req.user.id
      ]
    );

    return res.json({ message: 'Perfil actualizado' });

  } catch (err) {
    console.error('Error en PUT /perfil:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
