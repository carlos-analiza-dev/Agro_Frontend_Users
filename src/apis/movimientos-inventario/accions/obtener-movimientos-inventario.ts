import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { MovimientosInvInterface } from "../interface/obtener-movimientos-inventario.interface";
import { MovimientosInvFilters } from "@/interfaces/filters/lotes-filter";

export const obtenerMovimientosInventario = async (
  filters?: MovimientosInvFilters,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/movimientos-inventario`;
  const response = await veterinariaAPI.get<MovimientosInvInterface>(url, {
    params: filters,
  });
  return response.data;
};
