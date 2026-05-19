import { TipoPrecio } from "@/interfaces/enums/paquetes/paquetes.enum";

export interface CrearPrecioPaqueteInterface {
  paqueteId: string;
  paisId: string;
  precioMensual: number;
  precioAnual: number;
  isActive: boolean;
}
