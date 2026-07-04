import { apiFetch } from "./api-client";

export async function getDecisions() {
  return apiFetch<{ decisions: any[] }>(`/decisions`);
}

export async function createDecision(data: any) {
  return apiFetch(`/decisions`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateDecision(data: any) {
  return apiFetch(`/decisions`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteDecision(id: string) {
  return apiFetch(`/decisions?id=${id}`, { method: "DELETE" });
}
