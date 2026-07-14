import { ObtenerPermisosAgro } from "@/apis/permisos-clientes/accions/obtener-permisos";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosAgro = (limit: number = 10, offset: number = 0) => {
  return useQuery({
    queryKey: ["permisos-agro", limit, offset],
    queryFn: () => ObtenerPermisosAgro(limit, offset),
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
};

export default useGetPermisosAgro;
