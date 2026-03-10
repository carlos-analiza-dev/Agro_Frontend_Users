import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseEspecies } from "../interfaces/response-especies.interface";

export const ObtenerEspecies = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/especie-animal`;

  const response = await veterinariaAPI.get<ResponseEspecies[]>(url);
  return response;
};
