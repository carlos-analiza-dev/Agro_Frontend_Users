import { ObtenerTipoProductoBySubCat } from "@/apis/tipo-producto/accions/obtener-tipo-producto-subcategoria";
import { useQuery } from "@tanstack/react-query";

const useGetTipoProductoBySubCategoria = (id: string) => {
  return useQuery({
    queryKey: ["tipo-producto-subcat", id],
    queryFn: () => ObtenerTipoProductoBySubCat(id),
    retry: false,
    enabled: !!id,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetTipoProductoBySubCategoria;
