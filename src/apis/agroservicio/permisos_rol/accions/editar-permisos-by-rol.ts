import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export interface EditarPermisoByRolInterface {
  permisosIds: string[];
}

export const editarPermisosRolesAgro = async (
  rolId: string,
  data: EditarPermisoByRolInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-permisos-agro/rol/${rolId}`;

  const response = await veterinariaAPI.patch(url, data);
  return response.data;
};
