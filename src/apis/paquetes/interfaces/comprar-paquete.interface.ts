export interface ComprarPaqueteInterface {
  paqueteId: string;
  fechaInicio: string;
  fechaFin: string;
}

export interface CompraExitosa {
  nombre: string;
  tipo: string;
  fechaFin: string;
  diasAgregados: number;
  duracionComprada: number;
}
