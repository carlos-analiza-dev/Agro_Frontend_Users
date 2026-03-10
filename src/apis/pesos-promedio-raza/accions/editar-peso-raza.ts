import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearPesoRazaInterface } from "../interface/crear-peso-raza.interface";

export const EditarPesoRaza = async (
  id: string,
  data: Partial<CrearPesoRazaInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/peso-esperado-raza/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
