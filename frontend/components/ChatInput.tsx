import { useState, useRef, useCallback, KeyboardEvent } from "react";

interface ChatInputProps {
    onSend: (content: string) => Promise<void>;
    isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = useCallback(async () => {
        const trimmed = value.trim();
        if (!trimmed || isLoading) return;
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        await onSend(trimmed);
    }, [value, isLoading, onSend]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLTextAreaElement>) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        },
        [handleSend]
    );

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, []);

    const canSend = value.trim().length > 0 && !isLoading;

    return (
        <div className={`flex items-end gap-3 bg-white border rounded-2xl px-4 py-3 shadow-sm transition-all ${canSend ? "border-indigo-300 shadow-indigo-100" : "border-slate-200"
            }`}>
            <textarea
                ref={textareaRef}
                rows={1}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                placeholder="Message AI… (Enter to send, Shift+Enter for new line)"
                className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50 max-h-40 leading-relaxed"
            />
            <button
                onClick={handleSend}
                disabled={!canSend}
                aria-label="Send message"
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                </svg>
            </button>
        </div>
    );
}