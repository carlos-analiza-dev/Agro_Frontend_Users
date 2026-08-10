export interface ResponseRolesFilter {
  roles: Role[];
  total: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  mostrarLight?: boolean;
}
