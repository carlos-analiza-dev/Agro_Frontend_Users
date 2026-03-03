import { obtenerNotificacionesAdm } from "@/apis/notificaciones_admins/acciones/obtener-notificaciones-admin";
import { useQuery } from "@tanstack/react-query";

const useGetNotificacionesAdmin = () => {
  return useQuery({
    queryKey: ["notificaciones-admin"],
    queryFn: () => obtenerNotificacionesAdm(),
    retry: 0,
  });
};

export default useGetNotificacionesAdmin;
