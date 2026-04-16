import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEspecieInterface } from "../interfaces/crear-especie.interface";

export const createEspecie = async (data: CrearEspecieInterface) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/especie-animal`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
