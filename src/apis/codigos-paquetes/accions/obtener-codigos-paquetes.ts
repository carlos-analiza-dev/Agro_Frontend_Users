import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseCodigosPaquetesInterface } from "../interfaces/response-codigos-paquetes.interface";
import { PaginationInterface } from "@/interfaces/paginacion/paginacion.interface";

export const ObtenerCodigosPauqtes = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/codigos-paquetes`;

  const response = await veterinariaAPI.get<ResponseCodigosPaquetesInterface>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
