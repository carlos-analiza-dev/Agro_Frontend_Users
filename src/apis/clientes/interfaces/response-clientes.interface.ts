import { TipoCliente } from "@/interfaces/enums/clientes.enums";

export interface ResponseClientesInterface {
  clientes: Cliente[];
  total: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  rol: TipoCliente;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
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
