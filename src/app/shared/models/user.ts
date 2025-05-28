export interface User {
  id: number;
  correo: string;
  contrasena?: string;
  rol: 'CLIENTE' | 'PROPIETARIO' | 'ADMINISTRADOR' | 'VERIFICADOR';
  token?: string;
  nombre: string;
  estado: string;
  apellido: string;
}

