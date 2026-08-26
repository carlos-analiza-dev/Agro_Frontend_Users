import { ObtenerCodigosPauqtes } from "@/apis/codigos-paquetes/accions/obtener-codigos-paquetes";
import { PaginationInterface } from "@/interfaces/paginacion/paginacion.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCodigosPaquetes = (filters?: PaginationInterface) => {
  return useQuery({
    queryKey: ["codigos-paquetes", filters],
    queryFn: () => ObtenerCodigosPauqtes(filters),
    retry: 1,
  });
};

export default useGetCodigosPaquetes;
