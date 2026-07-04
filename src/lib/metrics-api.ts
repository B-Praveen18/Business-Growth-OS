import { apiFetch } from "./api-client";

export async function getMetrics(companyId?: string) {
  const query = companyId ? `?companyId=${companyId}` : '';
  return apiFetch<{ metrics: any[] }>(`/metrics${query}`);
}

export async function createMetric(data: any) {
  return apiFetch(`/metrics`, { method: "POST", body: JSON.stringify(data) });
}

export async function updateMetric(data: any) {
  return apiFetch(`/metrics`, { method: "PUT", body: JSON.stringify(data) });
}

export async function deleteMetric(id: string) {
  return apiFetch(`/metrics?id=${id}`, { method: "DELETE" });
}
