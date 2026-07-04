import { apiFetch } from "./api-client";

export async function getChatHistory() {
  return apiFetch<{ session: any }>(`/chat`);
}

export async function sendChatMessage(message: string) {
  return apiFetch<{ message: any; session: any }>(`/chat`, { method: "POST", body: JSON.stringify({ message }) });
}
