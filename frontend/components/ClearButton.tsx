interface ClearButtonProps {
    onClick: () => void;
    disabled: boolean;
}

export default function ClearButton({ onClick, disabled }: ClearButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label="Clear conversation"
            className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-ink-soft)] transition-colors hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)] disabled:pointer-events-none disabled:opacity-35"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-4 w-4 text-[var(--color-ink-faint)] transition-colors group-hover:text-[var(--color-accent)]"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6m3 0-.8 12.1A2 2 0 0 1 16.2 20H7.8a2 2 0 0 1-2-1.9L5 6" />
            </svg>
            <span className="hidden sm:inline">Clear chat</span>
        </button>
    );
}
