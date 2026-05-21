import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseVeterinarios } from "../interfaces/veterinarios-response.interface";

export const obtenerGerentes = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/gerentes`;
  const respose = await veterinariaAPI.get<ResponseVeterinarios[]>(url);
  return respose.data;
};
