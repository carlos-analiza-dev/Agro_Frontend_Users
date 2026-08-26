import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCodigoInterface } from "../interfaces/crear-codigo.interface";

export const crearCodigoPaquete = async (data: CrearCodigoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/codigos-paquetes`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
