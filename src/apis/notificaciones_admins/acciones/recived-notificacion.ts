import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const checkNotification = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/notificaciones-admins/${id}`;

  const response = await veterinariaAPI.patch(url);
  return response;
};
