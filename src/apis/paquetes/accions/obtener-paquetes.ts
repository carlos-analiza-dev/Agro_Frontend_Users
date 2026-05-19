import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePaquetesInterface } from "../interfaces/response-paquetes.interface";

export const ObtenerPaquetes = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquetes`;

  const response = await veterinariaAPI.get<ResponsePaquetesInterface[]>(url);
  return response.data;
};
