import { User } from './user';

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol: 'CLIENTE' | 'PROPIETARIO' | 'ADMINISTRADOR' | 'VERIFICADOR';
}

export interface RegisterResponse {
  id: number;
  correo: string;
  rol: 'CLIENTE' | 'PROPIETARIO' | 'ADMINISTRADOR' | 'VERIFICADOR';
  nombre: string;
  apellido: string;
}