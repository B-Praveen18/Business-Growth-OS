import { apiFetch } from "./api-client";

export async function getActivity() {
  return apiFetch<{ activity: any[] }>(`/activity`);
}
