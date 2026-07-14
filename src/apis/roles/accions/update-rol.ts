import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateRolI } from "../interfaces/crear-rol.interface";

export const UpdateRol = async (id: string, data: Partial<CreateRolI>) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};

export const UpdateRolAgro = async (id: string, data: Partial<CreateRolI>) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-agro/${id}`;

  const response = await veterinariaAPI.patch(url, data);
  return response;
};
