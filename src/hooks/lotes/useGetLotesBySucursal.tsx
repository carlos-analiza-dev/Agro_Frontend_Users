import { obtenerLotesSucursal } from "@/apis/lotes/accions/obtener-lotes-sucursal";
import { LotesFiltersInterafce } from "@/interfaces/filters/lotes-filter";
import { useQuery } from "@tanstack/react-query";

const useGetLotesBySucursal = (
  sucursalId: string,
  filters?: LotesFiltersInterafce,
) => {
  return useQuery({
    queryKey: ["lotes-sucursal", sucursalId, filters],
    queryFn: () => obtenerLotesSucursal(sucursalId, filters),
    retry: 0,
  });
};

export default useGetLotesBySucursal;
