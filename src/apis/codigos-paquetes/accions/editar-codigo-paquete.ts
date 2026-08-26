import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearCodigoInterface } from "../interfaces/crear-codigo.interface";

export const editarCodigoPaquete = async (
  id: string,
  data: Partial<CrearCodigoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/codigos-paquetes/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
