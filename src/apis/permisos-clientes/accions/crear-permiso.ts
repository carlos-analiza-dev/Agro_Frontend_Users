import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPermisoInterface } from "../interfaces/crear-permiso.interface";

export const CrearPermisoCliente = async (data: CrearPermisoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const CrearPermisoAgro = async (data: CrearPermisoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes-agro`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
