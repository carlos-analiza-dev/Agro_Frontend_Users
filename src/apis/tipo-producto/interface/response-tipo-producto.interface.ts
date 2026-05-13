import { Categoria } from "@/apis/categorias/interface/response-categorias.interface";
import { SubCategoria } from "@/apis/subcategorias/interface/get-subcategorias.interface";

export interface ResponseTipoProductoInterface {
  tipos: TipoProducto[];
  total: number;
  limit: number;
  offset: number;
}

export interface TipoProducto {
  id: string;
  nombre: string;
  descripcion: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  sub_categoria?: SubCategoria;
  categoria?: Categoria;
}
