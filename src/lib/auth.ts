export interface User {
  name: string;
  company: string;
  email: string;
  password: string;
  createdAt: string;
}

const USER_STORAGE_KEY = "businessos_user";
const CURRENT_USER_STORAGE_KEY = "businessos_current_user";

function parseJson<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function ensureLocalStorage() {
  if (typeof window === "undefined") {
    throw new Error("Local storage is unavailable.");
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  return parseJson<User>(window.localStorage.getItem(USER_STORAGE_KEY));
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  return parseJson<User>(window.localStorage.getItem(CURRENT_USER_STORAGE_KEY));
}

export function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  }
}

export async function registerUser(data: Omit<User, "createdAt">) {
  ensureLocalStorage();
  const existing = getStoredUser();
  if (existing && existing.email.toLowerCase() === data.email.toLowerCase()) {
    throw new Error("An account already exists with that email.");
  }

  const user: User = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  setCurrentUser(user);
  return user;
}

export async function loginUser(email: string, password: string) {
  ensureLocalStorage();
  const user = getStoredUser();
  if (!user) {
    throw new Error("No account found. Please register first.");
  }

  if (user.email.toLowerCase() !== email.toLowerCase() || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  setCurrentUser(user);
  return user;
}

export async function logout() {
  ensureLocalStorage();
  setCurrentUser(null);
}
