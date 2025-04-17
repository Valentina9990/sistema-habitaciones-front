export interface User {
  id: number;
  correo: string;
  contrasena: string;
  rol: 'CLIENTE' | 'PROPIETARIO' | 'ADMIN';
  token?: string;
  nombre: string;
  apellido: string;
}

