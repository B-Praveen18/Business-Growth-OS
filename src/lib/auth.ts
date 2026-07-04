export interface User {
  name: string;
  role: string;
  company: string;
  email: string;
  password: string;
  phone?: string;
  industry?: string;
  monthlyRevenue?: string;
  businessDescription?: string;
  website?: string;
  timezone?: string;
  createdAt: string;
}

const CURRENT_USER_STORAGE_KEY = "businessos_current_user";
const AUTH_TOKEN_STORAGE_KEY = "businessos_auth_token";
const API_BASE = "/api/auth";

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  return parseJson<User>(window.localStorage.getItem(CURRENT_USER_STORAGE_KEY));
}

export function setCurrentUser(user: User | null, token?: string) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
    if (token) window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

async function apiFetch(path: string, options: RequestInit) {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) : null;
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
    const message = result?.message || "Server error while contacting auth API.";
    throw new Error(message);
  }

  return result as { user: User; token?: string };
}

export async function registerUser(data: Omit<User, "createdAt">) {
  const result = await apiFetch("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  setCurrentUser(result.user, result.token);
  return result.user;
}

export async function loginUser(email: string, password: string) {
  const result = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setCurrentUser(result.user, result.token);
  return result.user;
}

export async function updateUser(user: User) {
  const result = await apiFetch("/user", {
    method: "PUT",
    body: JSON.stringify(user),
  });

  setCurrentUser(result.user, result.token);
  return result.user;
}

export async function logout() {
  setCurrentUser(null);
}
