import { apiFetch } from "./api-client";

export async function getChatHistory(agentId: string = "boardroom") {
  return apiFetch<{ session: any } & any>(`/chat?agentId=${encodeURIComponent(agentId)}`);
}

export async function sendChatMessage(message: string, agentId: string = "boardroom") {
  return apiFetch<{ message: any; session: any }>(
    `/chat?agentId=${encodeURIComponent(agentId)}`,
    { method: "POST", body: JSON.stringify({ message }) }
  );
}
