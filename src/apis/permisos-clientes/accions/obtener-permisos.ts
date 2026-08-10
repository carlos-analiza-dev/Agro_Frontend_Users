import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePermisosInterface } from "../interfaces/response-permisos.interface";
import { PaginationInterface } from "@/interfaces/paginacion/paginacion.interface";

export const ObtenerPermisosClientes = async (
  limit: number = 10,
  offset: number = 0,
) => {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
  };

  const queryString = new URLSearchParams(params).toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes?${queryString}`;

  const response = await veterinariaAPI.get<ResponsePermisosInterface>(url);
  return response.data;
};

export const ObtenerPermisosAgro = async (filters?: PaginationInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes-agro`;

  const response = await veterinariaAPI.get<ResponsePermisosInterface>(url, {
    params: filters,
  });
  return response.data;
};
