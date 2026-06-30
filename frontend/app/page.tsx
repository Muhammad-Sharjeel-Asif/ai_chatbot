"use client";

import { useChat } from "@/hooks/useChat";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import ClearButton from "@/components/ClearButton";

export default function Home() {
    const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

    return (
        <main className="min-h-screen bg-grid">
            <div className="mx-auto flex h-screen max-w-5xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:max-w-6xl lg:px-8 xl:max-w-7xl 2xl:max-w-[88rem]">
                {/* Header */}
                <header className="mb-4 flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-5 py-3.5 backdrop-blur-sm sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-ink)] font-mono text-sm font-semibold text-[var(--color-accent)]">
                            &gt;_
                        </div>

                        <div>
                            <h1 className="text-[15px] font-semibold leading-tight tracking-tight text-[var(--color-ink)]">
                                AI Assistant
                            </h1>
                            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)]">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Powered by Groq
                            </div>
                        </div>
                    </div>

                    <ClearButton
                        onClick={clearMessages}
                        disabled={isLoading || messages.length === 0}
                    />
                </header>

                {/* Chat */}
                <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60">
                    <ChatWindow
                        messages={messages}
                        isLoading={isLoading}
                        error={error}
                    />
                </section>

                {/* Input */}
                <footer className="mt-4">
                    <ChatInput onSend={sendMessage} isLoading={isLoading} />
                </footer>
            </div>
        </main>
    );
}
