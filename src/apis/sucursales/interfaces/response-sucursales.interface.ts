export interface ResponseSucursales {
  data: Sucursal[];
  total: number;
  limit: number;
  offset: number;
  filters: Filters;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  isActive: boolean;
  longitud: number;
  latitud: number;
  createdAt: Date;
  updatedAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  gerente?: Gerente | null;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Gerente {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
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

export interface Filters {}
