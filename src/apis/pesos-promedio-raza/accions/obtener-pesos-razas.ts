import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { PesosPromedioRazasInterface } from "../interface/response-pesos-prom.interface";

export const ObtenerPesosRazas = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-esperado-raza`;

  const response = await veterinariaAPI.get<PesosPromedioRazasInterface[]>(url);
  return response.data;
};
