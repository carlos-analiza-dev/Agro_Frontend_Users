export interface CrearSubServicio {
  nombre: string;
  tipo: string;
  unidad_venta: string;
  codigo_barra?: string;
  atributos?: string;
  taxId?: string;
  precio?: number;
  costo?: number;
  descripcion?: string;
  disponible?: boolean;
  isActive?: boolean;
  servicioId?: string;
  marcaId?: string;
  proveedorId?: string;
  categoriaId?: string;
  subcategoriaId?: string;
  tipo_producto_id?: string;
  paisId?: string;
  compra_minima?: number;
  distribucion_minima?: number;
  venta_minima?: number;
  unidad_fraccionamiento?: number;
  contenido?: number;
  tipo_fraccionamiento?: string;
  es_compra_bodega?: boolean;
  componentes?: {
    nombre: string;
    cantidad?: string;
    unidad?: string;
  }[];
  tipos_uso?: string[];
  forma_uso?: string;
  indicaciones?: string[];
}
