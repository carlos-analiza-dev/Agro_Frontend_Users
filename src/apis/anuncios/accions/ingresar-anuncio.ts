import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";

export const IngresarAnuncio = async (formData: FormData) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/anuncios-principales`;

  const response = await veterinariaAPI.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};
