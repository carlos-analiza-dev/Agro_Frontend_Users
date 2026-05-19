import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  CrearPedidoInterface,
  EstadoPedido,
} from "../interface/crear-pedido.interface";

export const EditarPedido = async (
  id: string,
  data: Partial<CrearPedidoInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const EditarAdminPedido = async (id: string, estado: EstadoPedido) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/pedidos/${id}/estado-admin/${estado}`;

  const response = await veterinariaAPI.patch(url, {});
  return response;
};
