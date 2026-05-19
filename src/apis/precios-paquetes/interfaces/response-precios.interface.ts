import { TipoPrecio } from "@/interfaces/enums/paquetes/paquetes.enum";

export interface ResponsePreciosInterface {
  id: string;
  precioMensual: string;
  precioAnual: string;
  isActive: boolean;
  paquete: Paquete;
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
  departamentos: Departamento[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}

export interface Paquete {
  id: string;
  nombre: string;
  tipo: string;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  isActive: boolean;
}
