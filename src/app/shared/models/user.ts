export interface User {
  id?: number;
  email: string;
  password?: string;
  role: 'CLIENTE' | 'PROPIETARIO' | 'ADMIN';
  token?: string;
  nombre?: string;
  apellido?: string;
}

