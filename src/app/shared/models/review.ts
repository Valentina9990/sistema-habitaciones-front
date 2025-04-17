export interface Review {
  id: string;
  idUsuario: string;
  idHabitacion: string;
  comentario: string;
  calificacion: number; // 1-5
  fecha: Date;
}
