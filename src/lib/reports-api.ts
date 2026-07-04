import { apiFetch } from "./api-client";

export async function getReports() {
  return apiFetch<{ reports: any[] }>(`/reports`);
}

export async function generateReport(data: any) {
  return apiFetch(`/reports`, { method: "POST", body: JSON.stringify(data) });
}
