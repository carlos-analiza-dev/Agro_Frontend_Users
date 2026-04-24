import { obtenerClientes } from "@/apis/clientes/accions/obtener-clientes";
import { useQuery } from "@tanstack/react-query";

const useGetClientesPagination = (
  debouncedSearchTerm: string,
  paisFilter: string,
  rol: string,
  limit: number,
  page: number,
) => {
  return useQuery({
    queryKey: ["clientes-admin", debouncedSearchTerm, paisFilter, rol, page],
    queryFn: () =>
      obtenerClientes(
        limit,
        (page - 1) * limit,
        debouncedSearchTerm,
        paisFilter,
        rol,
      ),
    retry: 0,
  });
};

export default useGetClientesPagination;
