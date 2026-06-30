import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { role: "user" | "assistant"; content: string };

export default function MessageBubble({ role, content }: Props) {
    const isUser = role === "user";
    const displayContent = content.trim() || " ";

    return (
        <div
            className={`message-enter flex w-full py-2 ${isUser ? "justify-end" : "justify-start"}`}
        >
            <div
                className={`flex items-start gap-2.5 ${isUser
                    ? "max-w-[88%] flex-row-reverse sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
                    : "max-w-[92%] sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
                    }`}
            >
                <div
                    className={`grid h-8 w-8 shrink-0 grow-0 basis-8 place-items-center self-start overflow-hidden rounded-lg font-mono text-[11px] font-bold leading-none ${isUser
                        ? "bg-[var(--color-accent)] text-white"
                        : "bg-[var(--color-ink)] text-[var(--color-accent)]"
                        }`}
                >
                    {isUser ? "U" : ">_"}
                </div>

                <div
                    className={`min-w-[88px] rounded-2xl px-4 py-2.5 text-center shadow-sm sm:min-w-[110px] sm:px-5 sm:py-3 ${isUser
                        ? "rounded-tr-sm bg-[var(--color-ink)] text-white"
                        : "rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)]"
                        }`}
                >                    <article className={isUser ? "prose-chat prose-chat-user" : "prose-chat"}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
                    </article>
                </div>
            </div>
        </div>
    );
}