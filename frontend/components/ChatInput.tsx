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
        <div className="mx-auto w-full max-w-5xl">
            <div
                className={`chat-input flex items-end gap-3 rounded-[28px] border bg-white px-5 py-4 shadow-lg transition-all duration-200 ${canSend
                        ? "border-indigo-300"
                        : "border-slate-200"
                    }`}
            >
                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    rows={2}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    placeholder="Ask me anything..."
                    className="flex-1 resize-none bg-transparent text-[15px] leading-7 text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50 max-h-40"
                />

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Send message"
                    className={`flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${canSend
                            ? "bg-slate-900 text-white hover:bg-slate-800"
                            : "bg-slate-200 text-slate-400"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                    >
                        <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                    </svg>
                </button>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
                AI can make mistakes. Verify important information.
            </p>
        </div>
    );
}