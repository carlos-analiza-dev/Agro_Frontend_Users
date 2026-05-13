import ObtenerProductosDisponibles from "@/apis/productos/accions/obtener-productos-disponibles";
import { FilterProductos } from "@/interfaces/filters/productos/filters-productos";
import { useQuery } from "@tanstack/react-query";

const useGetProductosDisponibles = (filters?: FilterProductos) => {
  return useQuery({
    queryKey: ["productos-disponibles", filters],
    queryFn: () => ObtenerProductosDisponibles(filters),
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetProductosDisponibles;
