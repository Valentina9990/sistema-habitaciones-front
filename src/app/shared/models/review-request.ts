export interface ReviewRequest {
  habitacionId: number;
  usuarioId: number;
  fecha:  string;
  calificacion: number;
  comentario: string;
}
