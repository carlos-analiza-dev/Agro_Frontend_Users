import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import {
  VerificarCuentaInterface,
  VerificarCuentaResponse,
} from "../interfaces/verificar-cuenta.interface";

export const VerificarCuenta = async (
  data: VerificarCuentaInterface
): Promise<VerificarCuentaResponse> => {
  try {
    const response = await veterinariaAPI.post<VerificarCuentaResponse>(
      "/auth/verify-account",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      const backendError = error.response.data;
      const errorWithData = new Error(
        backendError.message || "Error verificando cuenta"
      );
      (errorWithData as any).response = backendError;
      throw errorWithData;
    }

    throw new Error(error.message || "Error de conexión con el servidor");
  }
};
