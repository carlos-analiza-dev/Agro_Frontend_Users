import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const EliminarPermisoByPaquete = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-permisos/${id}`;
  const response = await veterinariaAPI.delete(url);
  return response;
};
