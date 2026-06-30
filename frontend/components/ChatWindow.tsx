"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types/chat";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";

interface ChatWindowProps {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}

export default function ChatWindow({
    messages,
    isLoading,
    error,
}: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const isEmpty = messages.length === 0 && !isLoading;

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12">
            {isEmpty ? (
                <div className="flex h-full items-center justify-center">
                    <div className="w-full max-w-xl px-6 text-center">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-ink)] font-mono text-base font-semibold text-[var(--color-accent)]">
                            &gt;_
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                            How can I help you today?
                        </h2>

                        <p className="mt-4 text-base text-[var(--color-ink-soft)] sm:text-lg">
                            Ask questions, generate code, explain concepts, debug errors,
                            summarize documents, and much more.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-1 lg:max-w-5xl xl:max-w-6xl">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            role={message.role}
                            content={message.content}
                        />
                    ))}

                    {isLoading && <TypingIndicator />}

                    {error && (
                        <div className="message-enter mx-auto flex w-full items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="mt-0.5 h-5 w-5 shrink-0"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}