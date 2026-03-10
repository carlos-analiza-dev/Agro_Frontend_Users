export interface PesosPromedioRazasInterface {
  id: string;
  edadMinMeses: number;
  edadMaxMeses: number;
  pesoEsperadoMin: string;
  pesoEsperadoMax: string;
  raza: Raza;
}

export interface Raza {
  id: string;
  nombre: string;
  abreviatura: string;
  isActive: boolean;
}
