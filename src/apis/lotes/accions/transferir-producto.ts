import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { TransferirProductoInterface } from "../interfaces/tranfsferir-producto.interface";

export const transferirProducto = async (data: TransferirProductoInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/lotes/transferir`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
