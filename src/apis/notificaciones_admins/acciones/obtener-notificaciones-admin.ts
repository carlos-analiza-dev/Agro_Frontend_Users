import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseNotificacionesAdminInterface } from "../interfaces/response-notififaciones-admin.interface";

export const obtenerNotificacionesAdm = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/notificaciones-admins`;

  const response =
    await veterinariaAPI.get<ResponseNotificacionesAdminInterface[]>(url);
  return response.data;
};
