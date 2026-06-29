// ─── Message roles ───────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

// ─── A single chat message ───────────────────────────────────────────────────

export interface Message {
  id: string;          // unique per message, used as React key
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// ─── What the frontend sends to the backend ──────────────────────────────────

export interface ChatRequestMessage {
  role: MessageRole;
  content: string;
}

export interface ChatRequest {
  messages: ChatRequestMessage[];
}

// ─── What the backend returns ────────────────────────────────────────────────

export interface ChatResponse {
  reply: string;
  success: boolean;
}

// ─── Hook return shape (used by useChat) ─────────────────────────────────────

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}