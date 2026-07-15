import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { ResponseRoles } from "../interfaces/response-roles.interface";
import { ResponseRolesFilter } from "../interfaces/response-roles-filters.interface";

export const getRoles = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles`;
  const response = await veterinariaAPI.get<ResponseRoles[]>(url);
  return response;
};

export const getRolesAgro = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-agro`;
  const response = await veterinariaAPI.get<ResponseRoles[]>(url);
  return response.data;
};

export const getRolesFilters = async (
  limit: number = 10,
  offset: number = 0,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles/filters?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseRolesFilter>(url);
  return response;
};

export const getRolesAgroFilters = async (
  limit: number = 10,
  offset: number = 0,
) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/roles-agro/filters?limit=${limit}&offset=${offset}`;

  const response = await veterinariaAPI.get<ResponseRolesFilter>(url);
  return response;
};
