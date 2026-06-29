"use client";

import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import ClearButton from "@/components/ClearButton";

export default function Home() {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  return (
    <main className="flex flex-col h-screen max-w-3xl mx-auto px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border border-slate-200 rounded-2xl px-5 py-3.5 shadow-sm flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">AI Chatbot</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs text-slate-400">Powered by Groq</p>
            </div>
          </div>
        </div>
        <ClearButton
          onClick={clearMessages}
          disabled={isLoading || messages.length === 0}
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0 mb-4">
        <ChatWindow messages={messages} isLoading={isLoading} error={error} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
        <p className="text-center text-[11px] text-slate-400 mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </main>
  );
}