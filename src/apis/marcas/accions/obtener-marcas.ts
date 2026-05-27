import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseMarcas } from "../interface/response-marcas.interface";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";

export const ObtenerMarcas = async (filters?: PaginationFilter) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/marcas`;

  const response = await veterinariaAPI.get<ResponseMarcas>(url, {
    params: filters,
  });
  return response.data;
};
