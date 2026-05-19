import { ObtenerPreciosPaquetes } from "@/apis/precios-paquetes/accions/obtener-precios-paquete";
import { useQuery } from "@tanstack/react-query";

const useGetPreciosPaquetes = () => {
  return useQuery({
    queryKey: ["precios-paquetes"],
    queryFn: ObtenerPreciosPaquetes,
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetPreciosPaquetes;
