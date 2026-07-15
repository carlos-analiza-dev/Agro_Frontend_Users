import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { IngresarPermisoByRolInterface } from "../interface/ingresar-permiso-rol.interface";

export const ingresarPermisosRolesAgro = async (
  data: IngresarPermisoByRolInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-permisos-agro`;

  const response = await veterinariaAPI.post(url, data);
  return response.data;
};
