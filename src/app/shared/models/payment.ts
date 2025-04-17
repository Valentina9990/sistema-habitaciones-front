interface Pago {
    id: string;                
    idReserva: string;
    idUsuario: string;         
    tipo: 'Inicial' | 'Final' | 'Parcial';
    monto: number;
    fecha: Date;
    metodo: string;
    estado: 'Aprobado' | 'Pendiente' | 'Rechazado';
}