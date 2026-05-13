import { ObtenerTiposProducto } from "@/apis/tipo-producto/accions/obtener-tipos-productos";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";
import { useQuery } from "@tanstack/react-query";

const useGetTiposProducto = (filters?: PaginationFilter) => {
  return useQuery({
    queryKey: ["tipos-producto", filters],
    queryFn: () => ObtenerTiposProducto(filters),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetTiposProducto;
