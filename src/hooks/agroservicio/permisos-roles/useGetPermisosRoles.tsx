import { ObtenerPermisosRolesAgro } from "@/apis/agroservicio/permisos_rol/accions/obtener-permisos-roles";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosRoles = () => {
  return useQuery({
    queryKey: ["permisos-roles"],
    queryFn: ObtenerPermisosRolesAgro,
    staleTime: 60 * 5 * 1000,
    retry: 1,
  });
};

export default useGetPermisosRoles;
