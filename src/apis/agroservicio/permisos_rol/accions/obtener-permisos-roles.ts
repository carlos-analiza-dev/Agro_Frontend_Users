import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  Permiso,
  ResponsePermisosRolesAgro,
} from "../interface/response-permisos-roles.interface";

export const ObtenerPermisosRolesAgro = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-permisos-agro`;

  const response = await veterinariaAPI.get<ResponsePermisosRolesAgro[]>(url);
  return response.data;
};

export const ObtenerPermisosNoRoles = async (rolId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-permisos-agro/not-rol/${rolId}`;

  const response = await veterinariaAPI.get<Permiso[]>(url);
  return response.data;
};
