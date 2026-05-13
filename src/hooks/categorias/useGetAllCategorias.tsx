import { ObtenerAllCategorias } from "@/apis/categorias/accions/get-categorias";
import { useQuery } from "@tanstack/react-query";

const useGetAllCategorias = () => {
  return useQuery({
    queryKey: ["all-categorias"],
    queryFn: ObtenerAllCategorias,
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetAllCategorias;
