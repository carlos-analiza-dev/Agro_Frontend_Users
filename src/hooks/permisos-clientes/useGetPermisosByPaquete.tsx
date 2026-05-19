import { ObtenerPermisosPaqueteId } from "@/apis/permisos-clientes/accions/obtener-permisos-paquete";
import { useQuery } from "@tanstack/react-query";

const useGetPermisosByPaquete = (paqueteId: string) => {
  return useQuery({
    queryKey: ["permisos-paqueteId", paqueteId],
    queryFn: () => ObtenerPermisosPaqueteId(paqueteId),
    staleTime: 60 * 1000 * 5,
    enabled: !!paqueteId,
    retry: false,
  });
};

export default useGetPermisosByPaquete;
