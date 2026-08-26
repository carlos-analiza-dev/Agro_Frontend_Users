import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";

export interface ResponseCodigosPaquetesInterface {
  data: CodigosPaquetes[];
  total: number;
}

export interface CodigosPaquetes {
  id: string;
  codigo: string;
  paqueteId: string;
  activo: boolean;
  fechaExpiracion: string;
  paquete: Paquete;
}

export interface Paquete {
  id: string;
  nombre: string;
  tipo: TipoPaquete;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  ecommerce: boolean;
  isActive: boolean;
}
