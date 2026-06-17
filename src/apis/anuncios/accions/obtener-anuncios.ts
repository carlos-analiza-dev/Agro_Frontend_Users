import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";
import { ResponseAnunciosInterface } from "../interfaces/response-anuncios.interface";

export const ObtenerAnuncios = async (filters?: PaginationFilter) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/anuncios-principales`;

  const response = await veterinariaAPI.get<ResponseAnunciosInterface>(url, {
    params: filters,
  });
  return response.data;
};
