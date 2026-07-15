import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PermisosClientes } from "../interfaces/response-permisos.interface";

export const ObtenerPermisosActivosClientes = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes/activos`;

  const response = await veterinariaAPI.get<PermisosClientes[]>(url);
  return response.data;
};

export const ObtenerPermisosActivosAgro = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes-agro/activos`;

  const response = await veterinariaAPI.get<PermisosClientes[]>(url);
  return response.data;
};
