interface Reservation {
  id: string;
  idUsuario: string;
  idHabitacion: string;
  fechaInicio: Date;
  fechaFin: Date;
  precioBaseHabitacion: number; // Precio base por noche
  montoServicios: number; // Monto por servicios adicionales
  montoTotal: number; // Precio total incluyendo habitación y servicios
  estado: 'Activa' | 'Cancelada' | 'Completada';
}
