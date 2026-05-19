import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPrecioPaqueteInterface } from "../interfaces/crear-precio-paquete.interface";

export const IngresarPrecioPaquete = async (
  data: CrearPrecioPaqueteInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-pais`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
