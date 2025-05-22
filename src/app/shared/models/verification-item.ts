export interface VerificationHistoryItem {
  id: number;
  habitacionId: number;
  direccion: string;
  ciudad: string;
  calificacion: number;
  comentario: string;
  fechaVerificacion: Date;
  verificadoPor: string;
}