import { ObtenerEspecies } from "@/apis/especies/accions/obtener-epecies";
import { useQuery } from "@tanstack/react-query";

const useGetEspecies = () => {
  return useQuery({
    queryKey: ["obtener-especies"],
    queryFn: ObtenerEspecies,
    retry: 0,
    staleTime: 60 * 100 * 5,
  });
};

export default useGetEspecies;
