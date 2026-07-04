const API_BASE = "/api";

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = typeof window !== "undefined" 
    ? window.localStorage.getItem("businessos_auth_token") 
    : null;
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || "Server error.");
  }
  return result as T;
}
