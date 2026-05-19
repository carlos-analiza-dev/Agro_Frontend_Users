import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPaqueteInterface } from "../interfaces/crear-paquete.interface";

export const EditarPaquete = async (
  id: string,
  data: Partial<CrearPaqueteInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquetes/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
