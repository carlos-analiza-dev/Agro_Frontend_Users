import { ObtenerPermisosNoRoles } from "@/apis/agroservicio/permisos_rol/accions/obtener-permisos-roles";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosNoRol = (rolId: string) => {
  return useQuery({
    queryKey: ["permisos-no-roles", rolId],
    queryFn: () => ObtenerPermisosNoRoles(rolId),
    retry: 1,
  });
};

export default useGetPermisosNoRol;
