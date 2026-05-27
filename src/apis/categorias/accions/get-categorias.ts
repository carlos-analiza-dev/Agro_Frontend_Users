import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  Categoria,
  ResponseCategoriasInterface,
} from "../interface/response-categorias.interface";
import { FiltersCategorias } from "@/interfaces/filters/categorias/filter-categorias.interface";

export const ObtenerCategorias = async (filters?: FiltersCategorias) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

  const response = await veterinariaAPI.get<ResponseCategoriasInterface>(url, {
    params: filters,
  });
  return response.data;
};

export const ObtenerAllCategorias = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias/all`;

  const response = await veterinariaAPI.get<Categoria[]>(url);
  return response.data;
};
