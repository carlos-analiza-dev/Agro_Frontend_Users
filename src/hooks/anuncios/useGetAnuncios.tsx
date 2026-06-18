import { ObtenerAnuncios } from "@/apis/anuncios/accions/obtener-anuncios";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";
import { useQuery } from "@tanstack/react-query";

const useGetAnuncios = (filters?: PaginationFilter) => {
  return useQuery({
    queryKey: ["anuncios", filters],
    queryFn: () => ObtenerAnuncios(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetAnuncios;
