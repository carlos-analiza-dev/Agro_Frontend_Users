export interface LotesFiltersInterafce {
  limit?: number;
  offset?: number;
}

export interface MovimientosInvFilters {
  limit?: number;
  offset?: number;
  fechaInicio?: string;
  fechaFin?: string;
  sucursal?: string;
}
