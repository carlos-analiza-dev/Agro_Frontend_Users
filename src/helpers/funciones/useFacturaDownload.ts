import { useState } from "react";
import { veterinariaAPI } from "../api/veterinariaAPI";

export const useFacturaDownload = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const descargarFactura = async (id: string, numeroFactura: string) => {
    setLoading(id);
    try {
      const response = await veterinariaAPI.get(`/facturas/${id}/pdf`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = `factura_${numeroFactura}.pdf`;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      };
    } finally {
      setLoading(null);
    }
  };

  const verFactura = async (id: string, numeroFactura: string) => {
    try {
      const response = await veterinariaAPI.get(`/facturas/${id}/preview`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      throw error;
    }
  };

  return {
    descargarFactura,
    verFactura,
    loading,
  };
};
