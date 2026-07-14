import { getRolesAgroFilters } from "@/apis/roles/accions/all-roles";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetRolesAgro = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["roles-agro", limit, offset],
    queryFn: () => getRolesAgroFilters(limit, offset),
    staleTime: 30 * 60 * 1000,
    retry: 0,
  });
};

export default useGetRolesAgro;
