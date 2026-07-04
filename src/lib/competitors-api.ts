import { apiFetch } from "./api-client";

export async function getCompetitors() {
  return apiFetch<{ competitors: any[] }>(`/competitors`);
}

export async function createCompetitor(data: any) {
  return apiFetch(`/competitors`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateCompetitor(data: any) {
  return apiFetch(`/competitors`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteCompetitor(id: string) {
  return apiFetch(`/competitors?id=${id}`, { method: "DELETE" });
}
