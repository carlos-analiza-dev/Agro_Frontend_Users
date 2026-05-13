import { ObtenerSubCategorias } from "@/apis/subcategorias/accions/get-subcategorias";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";
import { useQuery } from "@tanstack/react-query";

const useGetSubCategorias = (filters?: PaginationFilter) => {
  return useQuery({
    queryKey: ["subcategorias", filters],
    queryFn: () => ObtenerSubCategorias(filters),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetSubCategorias;
