import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";

export const getTipoText = (tipo: TipoPaquete) => {
  switch (tipo) {
    case TipoPaquete.FREE:
      return "Gratuito";
    case TipoPaquete.BASICO:
      return "Básico";
    case TipoPaquete.PREMIUM:
      return "Premium";
    case TipoPaquete.AGRO_GESTION:
      return "Agro Géstion";
    case TipoPaquete.AGRO_LIGHT:
      return "Agro Light";
    case TipoPaquete.EMPRESARIAL:
      return "Empresarial";

    default:
      return tipo;
  }
};
