import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPermisoPaqueteInterface } from "../interfaces/crear-permiso-paquete.interface";

export const CrearPermisoByPaquete = async (
  data: CrearPermisoPaqueteInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-permisos`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
