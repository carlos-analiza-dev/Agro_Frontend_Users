import ObtenerProductosDisponibles from "@/apis/productos/accions/obtener-productos-disponibles";
import { FilterProductos } from "@/interfaces/filters/productos/filters-productos";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

const useGetProductosDisponibles = (filters?: FilterProductos) => {
  return useQuery({
    queryKey: ["productos-disponibles", filters],
    queryFn: async () => {
      try {
        const response = await ObtenerProductosDisponibles(filters);
        return response;
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          return { data: { productos: [] } };
        }

        throw error;
      }
    },
    retry: false,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetProductosDisponibles;
