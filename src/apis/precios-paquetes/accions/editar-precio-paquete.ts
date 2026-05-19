import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPrecioPaqueteInterface } from "../interfaces/crear-precio-paquete.interface";

export const EditarPrecioPaquete = async (
  id: string,
  data: CrearPrecioPaqueteInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-pais/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
