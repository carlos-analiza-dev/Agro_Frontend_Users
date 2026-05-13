import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  Categoria,
  ResponseCategoriasInterface,
} from "../interface/response-categorias.interface";

export const ObtenerCategorias = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias`;

  const response = await veterinariaAPI.get<ResponseCategoriasInterface>(url);
  return response.data;
};

export const ObtenerAllCategorias = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/categorias/all`;

  const response = await veterinariaAPI.get<Categoria[]>(url);
  return response.data;
};
