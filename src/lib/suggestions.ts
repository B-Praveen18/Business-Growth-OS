export interface CompanySuggestion {
  _id?: string;
  userEmail: string;
  title: string;
  description: string;
  category: "growth" | "efficiency" | "risk" | "revenue" | "operations";
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
  impact?: string;
  priority?: "high" | "medium" | "low";
}

const API_BASE = "/api";

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const message = result?.message || "Server error.";
    throw new Error(message);
  }

  return result as T;
}

export async function getSuggestions(userEmail: string): Promise<CompanySuggestion[]> {
  const result = await apiFetch<{ suggestions: CompanySuggestion[] }>(
    `/suggestions?email=${encodeURIComponent(userEmail)}`,
  );
  return result.suggestions;
}

export async function addSuggestion(
  userEmail: string,
  suggestion: Omit<CompanySuggestion, "_id" | "userEmail" | "createdAt" | "status">,
): Promise<CompanySuggestion> {
  const result = await apiFetch<{ suggestion: CompanySuggestion }>(
    "/suggestions",
    {
      method: "POST",
      body: JSON.stringify({ userEmail, ...suggestion }),
    },
  );
  return result.suggestion;
}

export async function updateSuggestionStatus(
  _id: string,
  status: "pending" | "accepted" | "rejected",
): Promise<CompanySuggestion> {
  const result = await apiFetch<{ suggestion: CompanySuggestion }>(
    "/suggestions",
    {
      method: "PUT",
      body: JSON.stringify({ _id, status }),
    },
  );
  return result.suggestion;
}
