import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearRazaAnimalInterface } from "../interfaces/crear-raza.interface";

export const createRaza = async (data: CrearRazaAnimalInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/raza-animal`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
