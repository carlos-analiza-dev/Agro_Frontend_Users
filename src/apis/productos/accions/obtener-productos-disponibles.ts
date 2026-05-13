import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseProductos } from "../interfaces/response-productos.interface";
import { FilterProductos } from "@/interfaces/filters/productos/filters-productos";

export const ObtenerProductosDisponibles = async (
  filters?: FilterProductos,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/sub-servicios/productos-disponibles`;

  const response = await veterinariaAPI.get<ResponseProductos>(url, {
    params: filters,
  });
  return response;
};

export default ObtenerProductosDisponibles;
