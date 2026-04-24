import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseClientesInterface } from "../interfaces/response-clientes.interface";
import { ObtenerClientesActivosInterface } from "../interfaces/response-clientes-activos.interface";

export const obtenerClientes = async (
  limit: number = 10,
  offset: number = 0,
  nombre: string = "",
  pais: string = "",
  rol: string = "",
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes/clientes?limit=${limit}&offset=${offset}&name=${nombre}&pais=${pais}&rol=${rol}`;

  const respose = await veterinariaAPI.get<ResponseClientesInterface>(url);
  return respose;
};

export const obtenerClientesActivos = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth-clientes`;

  const respose =
    await veterinariaAPI.get<ObtenerClientesActivosInterface>(url);
  return respose;
};
