export default function TypingIndicator() {
    return (
        <div className="message-enter flex w-full items-start gap-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-ink)] font-mono text-[10px] font-bold text-[var(--color-accent)]">
                &gt;_
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 shadow-sm">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
            </div>
        </div>
    );
}
