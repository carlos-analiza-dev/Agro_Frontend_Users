import { ObtenerSubCategoriasByCategoria } from "@/apis/subcategorias/accions/get-subcategorias";
import { useQuery } from "@tanstack/react-query";

const useGetSubCategoriaByCat = (id: string) => {
  return useQuery({
    queryKey: ["subcategorias-cat", id],
    queryFn: () => ObtenerSubCategoriasByCategoria(id),
    retry: false,
    enabled: !!id,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetSubCategoriaByCat;
