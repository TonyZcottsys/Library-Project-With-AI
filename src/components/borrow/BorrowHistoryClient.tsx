"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";

type BorrowStatus = "BORROWED" | "RETURNED";

type BorrowRecordRow = {
  id: string;
  borrowDate: string;
  returnDate: string | null;
  status: BorrowStatus;
  book: {
    id: string;
    title: string;
    author: string;
    category: string;
    isbn: string;
  };
};

export function BorrowHistoryClient() {
  const { data } = useSession();
  const [records, setRecords] = useState<BorrowRecordRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/borrow/history", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load borrow history");
      const json = (await res.json()) as { records: BorrowRecordRow[] };
      setRecords(json.records);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load borrow history");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleReturn(bookId: string) {
    const res = await fetch("/api/borrow/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId })
    });
    if (!res.ok) {
      window.alert("Failed to return book.");
      return;
    }
    await load();
  }

  const emptyState = useMemo(() => {
    if (loading) return "Loading…";
    if (error) return error;
    return "No borrow records yet. Check out a book to see it here.";
  }, [loading, error]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Borrow history</h1>
          <p className="text-sm text-slate-400">
            {data?.user?.email ?? "—"} borrowing activity.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-3 shadow-lg shadow-slate-950/40">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm text-slate-50">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="px-3 py-2">Book</th>
              <th className="px-3 py-2">Borrowed</th>
              <th className="px-3 py-2">Returned</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {!loading && !error && records.length === 0 ? (
              <tr className="bg-slate-900/80">
                <td
                  className="rounded-lg border border-slate-800 px-3 py-3 text-slate-400"
                  colSpan={5}
                >
                  {emptyState}
                </td>
              </tr>
            ) : null}
            {loading || error
              ? null
              : records.map((r) => (
                  <tr key={r.id} className="bg-slate-900/80">
                    <td className="rounded-l-lg border border-slate-800 px-3 py-3">
                      <div className="font-medium text-slate-50">
                        {r.book.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {r.book.author} • {r.book.category}
                      </div>
                    </td>
                    <td className="border-y border-slate-800 px-3 py-3 text-slate-200">
                      {new Date(r.borrowDate).toLocaleDateString()}
                    </td>
                    <td className="border-y border-slate-800 px-3 py-3 text-slate-200">
                      {r.returnDate ? new Date(r.returnDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="border-y border-slate-800 px-3 py-3">
                      <span
                        className={[
                          "rounded-full px-2 py-1 text-xs font-medium",
                          r.status === "BORROWED"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-emerald-50 text-emerald-700"
                        ].join(" ")}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="rounded-r-lg border border-slate-800 px-3 py-3 text-right">
                      {r.status === "BORROWED" ? (
                        <button
                          className="btn-secondary border-slate-700 bg-slate-900/80 text-xs text-slate-100"
                          onClick={() => handleReturn(r.book.id)}
                        >
                          Return
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        This page is backed by the `BorrowRecord` model.
      </div>
    </div>
  );
}

