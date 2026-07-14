import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { CreateRolI } from "../interfaces/crear-rol.interface";

export const AddRol = async (data: CreateRolI) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};

export const AddRolAgro = async (data: CreateRolI) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-agro`;

  const response = await veterinariaAPI.post(url, data);
  return response;
};
