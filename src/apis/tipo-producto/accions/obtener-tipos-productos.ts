import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PaginationFilter } from "@/interfaces/filters/productos/filters-tipos-productos.interface";
import { ResponseTipoProductoInterface } from "../interface/response-tipo-producto.interface";

export const ObtenerTiposProducto = async (filters?: PaginationFilter) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/tipo-producto`;

  const response = await veterinariaAPI.get<ResponseTipoProductoInterface>(
    url,
    {
      params: filters,
    },
  );
  return response.data;
};
