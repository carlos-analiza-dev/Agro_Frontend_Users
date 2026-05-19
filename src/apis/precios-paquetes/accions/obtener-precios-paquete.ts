import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePreciosInterface } from "../interfaces/response-precios.interface";

export const ObtenerPreciosPaquetes = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-pais`;

  const response = await veterinariaAPI.get<ResponsePreciosInterface[]>(url);
  return response.data;
};
