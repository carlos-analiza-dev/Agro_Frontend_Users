import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPermisoInterface } from "../interfaces/crear-permiso.interface";

export const EditarPermisoCliente = async (
  id: string,
  data: Partial<CrearPermisoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const EditarPermisoAgro = async (
  id: string,
  data: Partial<CrearPermisoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/permisos-clientes-agro/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
