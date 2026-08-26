import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const eliminarCodigoPaquete = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/codigos-paquetes/${id}`;

  const response = await veterinariaAPI.delete(url, {});
  return response;
};
