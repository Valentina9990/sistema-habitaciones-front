export interface Review {
  id: string;
  usuarioId: string;
  habitacionId: string;
  fecha: Date;
  calificacion: number;
  comentario: string;
}
