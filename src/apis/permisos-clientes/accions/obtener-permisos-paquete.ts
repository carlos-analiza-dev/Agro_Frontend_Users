import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponsePermisoClienteInterface } from "../interfaces/response-permisos-cliente";

export const ObtenerPermisosPaqueteId = async (paqueteId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/paquete-permisos/paquete/${paqueteId}`;

  const response =
    await veterinariaAPI.get<ResponsePermisoClienteInterface[]>(url);
  return response.data;
};
