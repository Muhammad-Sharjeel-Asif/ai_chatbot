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

export default function ChatWindow({ messages, isLoading, error }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const isEmpty = messages.length === 0 && !isLoading;

    return (
        <div className="flex-1 overflow-y-auto px-2 py-6 space-y-5">
            {isEmpty && (
                <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className="text-slate-700 font-semibold text-base">How can I help you today?</p>
                        <p className="text-slate-400 text-sm mt-1">Ask me anything — I'm here to help.</p>
                    </div>
                </div>
            )}

            {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading && <TypingIndicator />}

            {error && (
                <div className="flex items-start gap-2.5 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}