import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ComprarPaqueteInterface } from "../interfaces/comprar-paquete.interface";

export const asignarPaqueteCliente = async (
  clienteId: string,
  data: ComprarPaqueteInterface,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/cliente-paquetes/cliente/${clienteId}`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
