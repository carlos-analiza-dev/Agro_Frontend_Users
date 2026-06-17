import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const ActualizarAnuncio = async (id: string, formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/anuncios-principales/${id}`;

  const response = await veterinariaAPI.patch(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
