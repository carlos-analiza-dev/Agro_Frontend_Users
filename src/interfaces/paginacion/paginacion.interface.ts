import { TipoAgroservicio } from "../enums/paquetes/paquetes.enum";

export interface PaginationInterface {
  limit?: number;
  offset?: number;
  principal?: boolean;
  mostrar?: boolean;
  name?: string;
  empleado?: string;
  departamento?: string;
  municipio?: string;
  sexo?: string;
  nombre?: string;
  categoria?: string;
  search?: string;
  subcategoria?: string;
  tipo_producto?: string;
  indicaciones?: string;
  tipo_uso?: string;
  tipo_servicio?: string;
  marca?: string;
  proveedor?: string;
  producto?: string;
  tipo_categoria?: string;
  insumo?: string;
  sucursal?: string;
  tipo_agro?: TipoAgroservicio;
  tipoPago?: string;
  tipoMantenimiento?: string;

  metodoPago?: string;
  metodo_pago?: string;

  numeroFactura?: string;
  servicio?: string;

  rol?: string;
  pais?: string;

  fincaId?: string;
  fincaNombre?: string;

  especieId?: string;
  especie?: string;

  identificador?: string;

  fecha?: string;
  fechaInicio?: string;
  fechaFin?: string;

  year?: number;

  animalId?: string;

  intensidad?: string;
  mes?: string;

  trabajadorId?: string;

  equipoId?: string;
  actividadId?: string;
  operadorId?: string;

  activos?: boolean;
  activo?: boolean;
  is_market?: boolean;
  destacada?: boolean;

  latitud?: number;
  longitud?: number;

  limite?: number;
  radio?: number;

  usarGoogleMaps?: boolean;

  categoriaId?: string;

  subcategoriaId?: string;

  tipoProductoId?: string;
}
