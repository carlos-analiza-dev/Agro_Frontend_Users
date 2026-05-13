import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  ResponseSubcategorias,
  SubCategoria,
} from "../interface/get-subcategorias.interface";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";

export const ObtenerSubCategorias = async (filters?: PaginationFilter) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/subcategorias`;

  const response = await veterinariaAPI.get<ResponseSubcategorias>(url, {
    params: filters,
  });
  return response.data;
};

export const ObtenerSubCategoriasByCategoria = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/subcategorias/categoria/${id}`;

  const response = await veterinariaAPI.get<SubCategoria[]>(url);
  return response.data;
};
