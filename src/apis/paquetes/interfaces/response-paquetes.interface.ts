import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";

export interface ResponsePaquetesInterface {
  id: string;
  nombre: string;
  tipo: TipoPaquete;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  isActive: boolean;
  ecommerce: boolean;
  preciosPorPais: PreciosPorPai[];
  permisos: PermisoElement[];
}

export interface PermisoElement {
  id: string;
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  permiso: PermisoPermiso;
}

export interface PermisoPermiso {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
  createdAt: Date;
}

export interface PreciosPorPai {
  id: string;
  tipo: string;
  precioMensual: string;
  precioAnual: string;
  isActive: boolean;
  pais: Pais;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
}
