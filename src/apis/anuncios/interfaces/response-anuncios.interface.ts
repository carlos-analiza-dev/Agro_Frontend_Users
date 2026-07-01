export interface ResponseAnunciosInterface {
  anuncios: Anuncio[];
  total: number;
  limit: number;
  offset: number;
}

export interface Anuncio {
  id: string;
  titulo: string;
  descripcion: string;
  link: string;
  esPrincipal: boolean;
  mostrar: boolean;
  etiqueta: EtiquetaAnuncio;
  fechaInicio?: string;
  fechaFin?: string;
  fecha_registro: Date;
  fecha_actualizacion: Date;
  pais: Pais;
  anucioImages: AnucioImage[];
}

export interface AnucioImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
}

export enum EtiquetaAnuncio {
  PATROCINADO = "PATROCINADO",
  OFERTA = "OFERTA ESPECIAL",
}
