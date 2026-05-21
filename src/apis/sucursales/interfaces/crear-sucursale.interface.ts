export interface CrearSucursaleInterface {
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  municipioId: string;
  departamentoId: string;
  paisId: string;
  latitud?: number;
  longitud?: number;
  gerenteId: string;
  isActive?: boolean;
}
