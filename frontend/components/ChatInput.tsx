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
        <div className="mx-auto w-full">
            <div
                className={`chat-input flex items-center gap-2 rounded-2xl border bg-[var(--color-surface)] py-2.5 pl-4 pr-2 shadow-sm transition-colors duration-150 sm:gap-3 sm:py-3 sm:pl-5 sm:pr-2.5 ${canSend ? "border-[var(--color-accent)]" : "border-[var(--color-border)]"
                    }`}
            >
                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    placeholder="Ask me anything..."
                    className="max-h-40 flex-1 resize-none bg-transparent text-[15px] leading-6 text-[var(--color-ink)] placeholder:text-[var(--color-ink-faint)] focus:outline-none disabled:opacity-50"
                />

                {/* Send Button */}
                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    aria-label="Send message"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-150 sm:h-10 sm:w-10 ${canSend
                            ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                            : "bg-[var(--color-paper)] text-[var(--color-ink-faint)]"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-[18px] w-[18px]"
                    >
                        <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
                    </svg>
                </button>
            </div>

            <p className="mt-2.5 text-center text-xs text-[var(--color-ink-faint)]">
                AI can make mistakes. Verify important information.
            </p>
        </div>
    );
}