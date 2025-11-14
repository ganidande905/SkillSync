// src/api/client.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API error ${res.status}: ${text || res.statusText || "Unknown error"}`
    );
  }
  return res.json() as Promise<T>;
}

export async function apiGet<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return handleResponse<T>(res);
}
export async function apiPost<T>(
  path: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  return handleResponse<T>(res);
}