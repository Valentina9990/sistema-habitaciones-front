export interface ReservationRequest {
  habitacionId: number;
  usuarioId: number;
  fechaCheckin: string;
  fechaCheckout: string;
  total: number;
}