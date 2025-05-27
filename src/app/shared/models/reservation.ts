export interface Reservation {
  id: string;
  habitacionId: number;
  usuarioId: number;
  fechaCheckin: number; 
  fechaCheckout: number; 
  estado: string;
  total: number;
  fechaCreacion: number;
}