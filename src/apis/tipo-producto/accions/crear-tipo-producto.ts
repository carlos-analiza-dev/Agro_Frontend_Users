import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearTipoProductoInterface } from "../interface/crear-tipo.interface";

export const CrearTipoProducto = async (data: CrearTipoProductoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/tipo-producto`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
