import { TipoCliente } from "@/interfaces/enums/clientes.enums";

export interface ObtenerClientesActivosInterface {
  clientes: Cliente[];
}

export interface Cliente {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  rol: TipoCliente;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: ProfileImage[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
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

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}
