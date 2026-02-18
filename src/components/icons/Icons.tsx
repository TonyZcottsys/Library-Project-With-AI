/**
 * Inline SVG icons with explicit fill so they are always visible.
 * Use className for size (e.g. h-5 w-5) and the wrapper can set color via text-*.
 */
export function BookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </svg>
  );
}

export function DashboardIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="12" rx="1" />
    </svg>
  );
}

export function BorrowHistoryIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 8v4l3 3" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

export function ChartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

export function BookCoverPlaceholder({
  letter,
  className = "h-16 w-16",
}: {
  letter: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-shrink-0 flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br from-indigo-900/60 to-slate-800 ${className}`}
    >
      <BookIcon className="h-6 w-6 text-indigo-300/90" />
      <span className="mt-0.5 text-lg font-bold text-slate-100">{letter}</span>
    </div>
  );
}
