import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
    message: Message;
}

function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === "user";

    return (
        <div className={`flex items-end gap-2.5 message-enter ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm ${isUser
                        ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                        : "bg-gradient-to-br from-indigo-500 to-blue-500"
                    }`}
            >
                {isUser ? "You" : "AI"}
            </div>

            <div className={`flex flex-col gap-1 max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                {/* Bubble */}
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
                            ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
                            : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
                        }`}
                >
                    <div className={`prose-chat ${isUser ? "prose-chat-user" : ""}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 px-1">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}