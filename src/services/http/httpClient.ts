// Mensaje estándar definido para errores 401
export const AUTH_ERROR_MESSAGE =
  'No fue posible validar la sesión. Por favor inicie sesión nuevamente.';

type AuthErrorHandler = (message: string) => void;

let onAuthError: AuthErrorHandler | null = null;

// Registrar el handler desde AuthContext
export function registerAuthErrorHandler(handler: AuthErrorHandler) {
  onAuthError = handler;
}

export function unregisterAuthErrorHandler() {
  onAuthError = null;
}

// Wrapper de fetch que intercepta 401 automáticamente
export async function httpClient(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    let message = AUTH_ERROR_MESSAGE;

    // Intentar leer el mensaje del body si sigue el formato acordado
    try {
      const body = await response.clone().json();
      if (body?.error === 'authentication_failed' && body?.message) {
        message = body.message;
      }
    } catch {
      // Si no es JSON, usar el mensaje por defecto
    }

    // Disparar el handler registrado (muestra el toast)
    if (onAuthError) {
      onAuthError(message);
    }
  }

  return response;
}