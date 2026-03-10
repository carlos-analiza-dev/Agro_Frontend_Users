import { ObtenerPesosRazas } from "@/apis/pesos-promedio-raza/accions/obtener-pesos-razas";
import { useQuery } from "@tanstack/react-query";

const useGetPesosPromedioRazas = () => {
  return useQuery({
    queryKey: ["pesos-promedio-razas"],
    queryFn: () => ObtenerPesosRazas(),
    staleTime: 5 * 60 * 1000,
  });
};

export default useGetPesosPromedioRazas;
