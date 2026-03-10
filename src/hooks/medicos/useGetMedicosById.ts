import { ObtenerMedicoById } from "@/apis/medicos/accions/obtener-medicoById";
import { useQuery } from "@tanstack/react-query";

const useGetMedicoById = (id: string) => {
  return useQuery({
    queryKey: ["medico-id", id],
    queryFn: () => ObtenerMedicoById(id),
    retry: 0,
    staleTime: 60 * 5 * 1000,
  });
};

export default useGetMedicoById;
