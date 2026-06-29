import axios, { AxiosError } from "axios";
import type { ChatRequest, ChatResponse } from "@/types/chat";

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ─── Send messages to backend ─────────────────────────────────────────────────

export async function sendChatRequest(payload: ChatRequest): Promise<ChatResponse> {
  try {
    const { data } = await api.post<ChatResponse>("/api/v1/chat/", payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ detail: string }>;

    if (error.response) {
      const detail = error.response.data?.detail ?? "Server error.";
      throw new Error(`[${error.response.status}] ${detail}`);
    }

    if (error.request) {
      throw new Error("Cannot reach the server. Is the backend running?");
    }

    throw new Error(error.message ?? "Unexpected error.");
  }
}