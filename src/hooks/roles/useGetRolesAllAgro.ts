import { getRolesAgro } from "@/apis/roles/accions/all-roles";
import { useQuery } from "@tanstack/react-query";

const useGetRolesAllAgro = () => {
  return useQuery({
    queryKey: ["roles-agro"],
    queryFn: () => getRolesAgro(),
    retry: 1,
  });
};

export default useGetRolesAllAgro;
