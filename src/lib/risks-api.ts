import { apiFetch } from "./api-client";

export async function getRisks() {
  return apiFetch<{ risks: any[] }>(`/risks`);
}

export async function createRisk(data: any) {
  return apiFetch(`/risks`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateRisk(data: any) {
  return apiFetch(`/risks`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteRisk(id: string) {
  return apiFetch(`/risks?id=${id}`, { method: "DELETE" });
}
