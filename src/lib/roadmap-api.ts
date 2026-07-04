import { apiFetch } from "./api-client";

export async function getRoadmapItems() {
  return apiFetch<{ items: any[] }>(`/roadmap`);
}

export async function createRoadmapItem(data: any) {
  return apiFetch(`/roadmap`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateRoadmapItem(data: any) {
  return apiFetch(`/roadmap`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteRoadmapItem(id: string) {
  return apiFetch(`/roadmap?id=${id}`, { method: "DELETE" });
}
