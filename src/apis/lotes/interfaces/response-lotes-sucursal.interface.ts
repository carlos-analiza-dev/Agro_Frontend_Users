export interface ResponseLotesBySucursal {
  total: number;
  limit: number;
  offset: number;
  lotes: Lote[];
}

export interface Lote {
  id: string;
  id_compra: string;
  id_sucursal: string;
  nombre_sucursal: string;
  id_producto: string;
  nombre_producto: string;
  codigo_producto: string;
  cantidad: number;
  costo: number;
  costo_por_unidad: number;
  created_at: Date;
  updated_at: Date;
}
