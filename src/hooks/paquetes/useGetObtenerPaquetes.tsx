import { ObtenerPaquetes } from "@/apis/paquetes/accions/obtener-paquetes";
import { useQuery } from "@tanstack/react-query";

const useGetObtenerPaquetes = () => {
  return useQuery({
    queryKey: ["paquetes"],
    queryFn: ObtenerPaquetes,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetObtenerPaquetes;
