import { ObtenerPermisosActivosAgro } from "@/apis/permisos-clientes/accions/obtener-permisos-activos";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosActivosAgro = () => {
  return useQuery({
    queryKey: ["permisos-activos-agro"],
    queryFn: ObtenerPermisosActivosAgro,
    staleTime: 60 * 1000 * 5,
    retry: false,
  });
};

export default useGetPermisosActivosAgro;
