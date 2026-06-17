import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const EliminarImagenAnuncio = async (id: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/images-anuncios/${id}`;

  const response = await veterinariaAPI.delete(url);

  return response;
};
