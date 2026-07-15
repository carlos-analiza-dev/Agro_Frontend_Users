export interface ResponsePermisosRolesAgro {
  id: string;
  rol: Rol;
  permiso: Permiso;
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Rol {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}
