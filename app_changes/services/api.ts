// services/api.ts
// Capa de comunicación entre la app y el backend HealthKids

const BASE_URL = 'http://10.0.2.2:3000/api'; 
// ⚠️  En Android Emulator usa 10.0.2.2 para referirse a tu localhost
// ⚠️  En dispositivo físico cambia a la IP local de tu máquina, ej: http://192.168.1.X:3000/api

import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Helpers ───────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('authToken');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data as T;
}

// ── Auth ──────────────────────────────────────────────────────

export interface Usuario {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido?: string;
  rol: 'admin' | 'nino' | 'padre';
  nivel?: number;
  xp_actual?: number;
  xp_total?: number;
  pasos_hoy?: number;
  liga?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

/** Iniciar sesión */
export async function login(username: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  // Guardar token en AsyncStorage
  await AsyncStorage.setItem('authToken', data.token);
  await AsyncStorage.setItem('usuarioActual', JSON.stringify(data.usuario));
  return data;
}

/** Registrar nuevo usuario */
export async function register(payload: {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  rol?: string;
}): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  await AsyncStorage.setItem('authToken', data.token);
  await AsyncStorage.setItem('usuarioActual', JSON.stringify(data.usuario));
  return data;
}

/** Obtener usuario + perfil actual desde el servidor */
export async function getMe(): Promise<{ usuario: Usuario }> {
  return request<{ usuario: Usuario }>('/auth/me');
}

/** Cerrar sesión (limpia AsyncStorage) */
export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove(['authToken', 'usuarioActual']);
}

/** Sincronizar perfil (XP, pasos, nivel) al servidor */
export async function syncPerfil(perfil: {
  xp_actual?: number;
  xp_total?: number;
  pasos_hoy?: number;
  pasos_total?: number;
  nivel?: number;
  minutos_activos?: number;
}): Promise<void> {
  await request('/auth/perfil', {
    method: 'PUT',
    body: JSON.stringify(perfil),
  });
}
