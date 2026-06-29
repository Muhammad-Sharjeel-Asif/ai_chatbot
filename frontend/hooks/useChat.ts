import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { sendChatRequest } from "@/services/chatService";
import type { Message, UseChatReturn, ChatRequestMessage } from "@/types/chat";

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    const history: ChatRequestMessage[] = [...messages, userMessage].map(
      ({ role, content }) => ({ role, content })
    );

    try {
      const response = await sendChatRequest({ messages: history });

      if (!response.success) {
        throw new Error("The assistant returned an unsuccessful response.");
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}