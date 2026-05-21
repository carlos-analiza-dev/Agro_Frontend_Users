import { obtenerGerentes } from "@/apis/users/accions/get-users-gerentes";
import { useQuery } from "@tanstack/react-query";

const useGetGerentes = () => {
  return useQuery({
    queryKey: ["users-gerentes"],
    queryFn: obtenerGerentes,
    retry: 0,
    staleTime: 60 * 5 * 100,
  });
};

export default useGetGerentes;
