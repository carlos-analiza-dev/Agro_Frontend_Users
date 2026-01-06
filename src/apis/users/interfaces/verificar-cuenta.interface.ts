export interface VerificarCuentaInterface {
  email: string;
}

export interface VerificarCuentaResponse {
  message: string;
  verified: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    verifiedAt?: string;
    role?: string;
  };
}
