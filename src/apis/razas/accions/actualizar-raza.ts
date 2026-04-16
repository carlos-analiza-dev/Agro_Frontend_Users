import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearRazaAnimalInterface } from "../interfaces/crear-raza.interface";

export const updateRaza = async (
  id: string,
  data: Partial<CrearRazaAnimalInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/raza-animal/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
