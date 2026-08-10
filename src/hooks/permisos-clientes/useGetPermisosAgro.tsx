import { ObtenerPermisosAgro } from "@/apis/permisos-clientes/accions/obtener-permisos";
import { PaginationInterface } from "@/interfaces/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosAgro = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["permisos-agro", filters],
    queryFn: () => ObtenerPermisosAgro(filters),
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
};

export default useGetPermisosAgro;
