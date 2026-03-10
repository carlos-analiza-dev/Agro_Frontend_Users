import { ObtenerRazasByEspecie } from "@/apis/razas/accions/obtener-razasbyEspecie";
import { useQuery } from "@tanstack/react-query";

const useGetRazasByEspecie = (especieId: string) => {
  return useQuery({
    queryKey: ["razas-especie", especieId],
    queryFn: () => ObtenerRazasByEspecie(especieId),
    retry: 0,
    enabled: !!especieId,
  });
};

export default useGetRazasByEspecie;
