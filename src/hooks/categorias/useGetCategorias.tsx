import { ObtenerCategorias } from "@/apis/categorias/accions/get-categorias";
import { FiltersCategorias } from "@/interfaces/filters/categorias/filter-categorias.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCategorias = (filters?: FiltersCategorias) => {
  return useQuery({
    queryKey: ["categorias", filters],
    queryFn: () => ObtenerCategorias(filters),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetCategorias;
