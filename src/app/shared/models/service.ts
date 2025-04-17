export interface Service{
  id: number;
  nombre: string;
  tipo: 'incluido' | 'adicional';
  precio?: number; // Precio para servicios adicionales
  icon?: string;   // Para mostrar un ícono en la ui
}