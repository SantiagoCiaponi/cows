// shared/api/api-error.ts
import axios from "axios";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// mapea el codigo de negocio que devuelve el backend (ApiException.code) a un mensaje amigable
const MAPPED_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Credenciales invalidas. Revisa los datos e intenta nuevamente.",
  EMAIL_TAKEN: "Ya existe una cuenta registrada con ese email.",
  INVALID_REFRESH_TOKEN: "Tu sesion expiro. Inicia sesion nuevamente.",
  VALIDATION_ERROR: "Revisa los datos ingresados.",
};

export const parseApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<{ message?: string; status?: number; code?: string }>(error)) {
    const data = error.response?.data;
    const status = error.response?.status ?? 0;
    const code = data?.code;

    // fallback en cascada: codigo conocido -> mensaje crudo del back -> mensaje generico
    const message = (code && MAPPED_MESSAGES[code]) || data?.message || "No pudimos completar la solicitud. Intenta nuevamente.";

    return { message, status, code };
  }

  if (error instanceof Error) {
    return { message: error.message, status: 0 };
  }

  return { message: "Error desconocido", status: 0 };
};
