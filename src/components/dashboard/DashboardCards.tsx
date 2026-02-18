import { BookIcon, BorrowHistoryIcon, ChartIcon } from "@/components/icons/Icons";

type DashboardCardsProps = {
  totalBooks: number;
  activeBorrows: number;
  mostBorrowed: { title: string; count: number } | null;
};

export function DashboardCards({
  totalBooks,
  activeBorrows,
  mostBorrowed
}: DashboardCardsProps) {
  const cards = [
    {
      label: "Total books",
      value: totalBooks,
      accent: "from-sky-500 to-cyan-400",
      Icon: BookIcon
    },
    {
      label: "Active borrows",
      value: activeBorrows,
      accent: "from-amber-500 to-orange-400",
      Icon: BorrowHistoryIcon
    },
    {
      label: "Most borrowed",
      value: mostBorrowed
        ? `${mostBorrowed.title} (${mostBorrowed.count} borrows)`
        : "—",
      accent: "from-violet-500 to-indigo-400",
      Icon: ChartIcon
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40"
        >
          <div
            className={[
              "pointer-events-none absolute inset-x-0 -top-10 h-20 bg-gradient-to-r opacity-40",
              c.accent
            ].join(" ")}
          />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {c.label}
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-50">
                {c.value}
              </div>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300">
              <c.Icon className="h-5 w-5" />
            </span>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 lg:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-50">
              Quick actions
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Jump straight into browsing or managing your own history.
            </div>
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            <a className="btn-primary" href="/books">
            Browse books
            </a>
            <a className="btn-secondary" href="/borrow-history">
              View borrow history
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

