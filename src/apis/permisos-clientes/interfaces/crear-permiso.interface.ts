import { TipoAgroservicio } from "@/interfaces/enums/paquetes/paquetes.enum";

export interface CrearPermisoInterface {
  nombre: string;
  tipo: TipoAgroservicio;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
}
