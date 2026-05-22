import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseLotesBySucursal } from "../interfaces/response-lotes-sucursal.interface";
import { LotesFiltersInterafce } from "@/interfaces/filters/lotes-filter";

export const obtenerLotesSucursal = async (
  sucursalId: string,
  filters?: LotesFiltersInterafce,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/lotes/sucursal/${sucursalId}`;
  const response = await veterinariaAPI.get<ResponseLotesBySucursal>(url, {
    params: filters,
  });
  return response.data;
};
