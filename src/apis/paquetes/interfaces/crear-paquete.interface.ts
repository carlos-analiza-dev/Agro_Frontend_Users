import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";

export interface CrearPaqueteInterface {
  nombre: string;
  tipo: TipoPaquete;
  maxFincas: number;
  maxAnimales: number;
  maxTrabajadores: number;
  isActive: boolean;
  ecommerce: boolean;
}
