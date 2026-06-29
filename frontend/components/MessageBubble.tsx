import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { role: "user" | "assistant"; content: string };

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  const displayContent = content.trim() || " ";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""} max-w-3xl`}>
        <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white ${isUser ? "bg-indigo-600" : "bg-slate-900"}`}>
          {isUser ? "You" : "AI"}
        </div>
        <div className={`relative max-w-[80%] rounded-2xl px-5 py-3 shadow ${isUser ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"}`}>
          <div className={`absolute top-4 h-0 w-0 border-8 border-solid ${isUser ? "-right-2 border-l-slate-900 border-r-transparent border-t-transparent border-b-transparent" : "-left-2 border-r-slate-100 border-l-transparent border-t-transparent border-b-transparent"}`} />
          <article className={isUser ? "prose-chat prose-chat-user" : "prose-chat"}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}