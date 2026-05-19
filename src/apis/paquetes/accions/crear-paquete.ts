import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPaqueteInterface } from "../interfaces/crear-paquete.interface";

export const IngresarPaquetes = async (data: CrearPaqueteInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquetes`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
