import { ObtenerMarcas } from "@/apis/marcas/accions/obtener-marcas";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAllMarcas = (filters?: PaginationFilter) => {
  return useQuery({
    queryKey: ["marcas", filters],
    queryFn: () => ObtenerMarcas(filters),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetAllMarcas;
