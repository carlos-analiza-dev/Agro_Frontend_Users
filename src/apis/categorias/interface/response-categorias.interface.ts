export interface ResponseCategoriasInterface {
  data: Categoria[];
  total: number;
  limit: number;
  offset: number;
}

export interface Categoria {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  is_active: boolean;
  is_market: boolean;
  destacada: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: AtedBy;
  updated_by: AtedBy;
}

export interface AtedBy {
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
