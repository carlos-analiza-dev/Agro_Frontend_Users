export interface ResponsePedidosInterface {
  total: number;
  pedidos: Pedido[];
}

export interface Pedido {
  id: string;
  id_cliente: string;
  sub_total: string;
  importe_exento: string;
  importe_exonerado: string;
  importe_gravado_15: string;
  importe_gravado_18: string;
  isv_15: string;
  isv_18: string;
  total: string;
  estado: string;
  direccion_entrega: string;
  latitud: null | string;
  longitud: null | string;
  tipo_entrega: string;
  costo_delivery: string;
  nombre_finca: null | string;
  created_at: string;
  updated_at: string;
  cliente: Cliente;
  detalles: Detalle[];
}

export interface Cliente {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: ProfileImage[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
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
  departamentos: Departamento[];
}

export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Detalle {
  id: string;
  id_pedido: string;
  id_producto: string;
  id_sucursal: string;
  precio: string;
  cantidad: number;
  total: string;
  producto: Producto;
  sucursal: Sucursal;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  contenido: number;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  latitud: null | string;
  longitud: null | string;
  gerenteId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
}
