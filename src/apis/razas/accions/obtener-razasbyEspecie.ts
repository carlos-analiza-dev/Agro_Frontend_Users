import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseRazas } from "../interfaces/response-razas.interface";

export const ObtenerRazasByEspecie = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/raza-animal/especie/${id}`;

  const response = await veterinariaAPI.get<ResponseRazas[]>(url);
  return response;
};
