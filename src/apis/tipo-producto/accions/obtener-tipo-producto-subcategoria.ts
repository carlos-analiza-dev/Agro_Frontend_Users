import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TipoProducto } from "../interface/response-tipo-producto.interface";

export const ObtenerTipoProductoBySubCat = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/tipo-producto/subcategoria/${id}`;

  const response = await veterinariaAPI.get<TipoProducto[]>(url);
  return response.data;
};
