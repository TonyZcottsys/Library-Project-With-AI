"use client";

import { useEffect, useState } from "react";

type Analytics = {
  totalBooks: number;
  activeBorrows: number;
  mostBorrowed: { title: string; count: number } | null;
};

export function AdminAnalyticsClient() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/admin/analytics", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load analytics");
        const json = (await res.json()) as Analytics;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Failed to load analytics"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalBooks = data?.totalBooks ?? "—";
  const activeBorrows = data?.activeBorrows ?? "—";
  const mostBorrowedLabel = data?.mostBorrowed
    ? `${data.mostBorrowed.title} (${data.mostBorrowed.count} borrows)`
    : "—";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">
            Admin analytics
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Totals and operational insights (role: ADMIN only).
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Total books
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {totalBooks}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Active borrows
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-50">
            {activeBorrows}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Most borrowed
          </div>
          <div className="mt-2 text-sm font-semibold text-slate-50">
            {mostBorrowedLabel}
          </div>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-500">
        {loading && !error && "Loading analytics…"}
        {error && <span className="text-red-400">Error: {error}</span>}
        {!loading && !error && "Analytics data is live from the database."}
      </div>
    </div>
  );
}

