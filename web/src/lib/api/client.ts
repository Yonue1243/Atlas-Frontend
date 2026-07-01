/**
 * Cliente REST minimalista y tipado para consumir la API de Atlas.
 *
 * El frontend nunca accede a los archivos JSON: toda la data proviene de esta
 * API. La URL base se configura con NEXT_PUBLIC_API_URL (default: localhost).
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Realiza un GET tipado contra la API y devuelve el JSON parseado. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `GET ${path} failed with ${res.status}`);
  }

  return (await res.json()) as T;
}
