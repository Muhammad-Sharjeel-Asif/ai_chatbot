"use client";

import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import ClearButton from "@/components/ClearButton";

export default function Home() {
    const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

    return (
        <main className="min-h-screen bg-grid">
            <div className="mx-auto flex h-screen max-w-6xl flex-col px-5 py-6">
                {/* Header */}
                <header className="mb-5 flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                            AI
                        </div> */}

                        <div className="w-full max-w-2xl px-6 text-center">
                            <h1 className="text-lg font-semibold tracking-tight text-slate-900 text-center
">
                                AI Assistant
                            </h1>

                            {/* <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Powered by Groq
                            </div> */}
                        </div>
                    </div>

                    <ClearButton
                        onClick={clearMessages}
                        disabled={isLoading || messages.length === 0}
                    />
                </header>

                {/* Chat */}
                <section className="flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        error={error}
                    />
                </section>

                {/* Input */}
                <footer className="mt-5">
                    <ChatInput
                        onSend={sendMessage}
                        isLoading={isLoading}
                    />

                    <p className="mt-3 text-center text-xs text-slate-400">
                        AI may generate incorrect information. Verify important responses.
                    </p>
                </footer>
            </div>
        </main>
    );
}