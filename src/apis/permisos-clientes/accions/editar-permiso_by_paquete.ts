import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPermisoPaqueteInterface } from "../interfaces/crear-permiso-paquete.interface";

export const EditarPermisoByPaquete = async (
  id: string,
  data: Partial<CrearPermisoPaqueteInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-permisos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
