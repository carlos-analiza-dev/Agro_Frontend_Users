import { obtenerMovimientosInventario } from "@/apis/movimientos-inventario/accions/obtener-movimientos-inventario";
import { MovimientosInvFilters } from "@/interfaces/filters/lotes-filter";
import { useQuery } from "@tanstack/react-query";

const useGetMovimientosInventario = (filters?: MovimientosInvFilters) => {
  return useQuery({
    queryKey: ["movimientos-inventario", filters],
    queryFn: () => obtenerMovimientosInventario(filters),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetMovimientosInventario;
