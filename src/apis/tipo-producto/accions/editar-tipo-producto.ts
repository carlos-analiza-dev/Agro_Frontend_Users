import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearTipoProductoInterface } from "../interface/crear-tipo.interface";

export const EditarTipoProducto = async (
  id: string,
  data: Partial<CrearTipoProductoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/tipo-producto/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
