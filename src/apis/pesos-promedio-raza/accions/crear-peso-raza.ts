import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPesoRazaInterface } from "../interface/crear-peso-raza.interface";

export const CrearPesoRaza = async (data: CrearPesoRazaInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-esperado-raza`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
