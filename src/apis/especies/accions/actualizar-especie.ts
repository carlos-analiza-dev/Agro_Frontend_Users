import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CrearEspecieInterface } from "../interfaces/crear-especie.interface";

export const updateEspecie = async (
  id: string,
  data: Partial<CrearEspecieInterface>,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/especie-animal/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
