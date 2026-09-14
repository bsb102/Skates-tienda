import { fetchAuthSession } from "aws-amplify/auth";
import { config } from "./config";

export interface Skate {
  id: number;
  modelo: string;
  marca: string;
  medida: number;
  stock: number;
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  return fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function obtenerCatalogo(): Promise<Skate[]> {
  const res = await apiFetch("/api/skate");
  if (!res.ok) {
    throw new Error(`El backend respondió ${res.status} al pedir el catálogo`);
  }
  return res.json();
}