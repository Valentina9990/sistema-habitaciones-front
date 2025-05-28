export interface Service{
  id: number;
  nombre: string;
  tipo?: 'incluido' | 'adicional';
  precio?: number;
  icon?: string;
}