import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { TipoMovimientoInventario } from "@/interfaces/enums/movimientos-inventario/tipos_movimientos.enum";

export interface MovimientosInvInterface {
  total: number;
  limit: number;
  offset: number;
  movimientos: Movimiento[];
}

export interface Movimiento {
  id: string;
  tipo: TipoMovimientoInventario;
  cantidad: string;
  created_at: string;
  lote: Lote;
  sucursalOrigen: Sucursal;
  sucursalDestino: Sucursal;
}

export interface Lote {
  id: string;
  producto: Producto;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
}
