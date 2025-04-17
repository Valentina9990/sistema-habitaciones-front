import { Service } from "./service";

export interface Room {
    id: number;
    ciudad: string;
    direccion: string;
    capacidad: number;
    priceNoche: number;
    descripcion: string;
    calificacion: number;
    serviciosIncluidos: Service[];
    serviciosAdicionales: Service[];
    imagenes: string[];
    verificada: boolean;
}