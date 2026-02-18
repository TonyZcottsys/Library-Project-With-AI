"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/auth/permissions";
import { useRouter } from "next/navigation";
import { BookCoverPlaceholder } from "@/components/icons/Icons";

type Book = {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  category: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
};

export function BooksPageClient() {
  const { data } = useSession();
  const role = data?.user?.role ?? "MEMBER";
  const router = useRouter();

  const canAdd = hasPermission(role, "BOOK_ADD");
  const canEdit = hasPermission(role, "BOOK_EDIT");
  const canDelete = hasPermission(role, "BOOK_DELETE");

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hint = useMemo(() => {
    if (canAdd) return "You can add/edit books. Use the Add Book button.";
    return "You can browse and borrow available books.";
  }, [canAdd]);

  async function loadBooks() {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (category) params.set("category", category);
      const res = await fetch(`/api/books?${params.toString()}`, {
        cache: "no-store"
      });
      if (!res.ok) throw new Error("Failed to load books");
      const json = (await res.json()) as { books: Book[] };
      setBooks(json.books);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleEdit(book: Book) {
    router.push(`/books/${book.id}/edit`);
  }

  async function handleDelete(book: Book) {
    if (!window.confirm(`Delete "${book.title}"?`)) return;

    const res = await fetch(`/api/books/${book.id}`, {
      method: "DELETE"
    });

    if (!res.ok) {
      window.alert("Failed to delete book.");
      return;
    }

    await loadBooks();
  }

  async function handleCheckout(book: Book) {
    if (book.availableCopies <= 0) return;
    const res = await fetch("/api/borrow/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookId: book.id })
    });

    if (!res.ok) {
      window.alert("Failed to check out book.");
      return;
    }

    await loadBooks();
  }

  const filteredBooks = useMemo(() => {
    if (!query && !category) return books;
    const q = query.toLowerCase();
    const c = category.toLowerCase();
    return books.filter((b) => {
      const matchesQ =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      const matchesC = !c || b.category.toLowerCase().includes(c);
      return matchesQ && matchesC;
    });
  }, [books, query, category]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Books</h1>
          <p className="text-sm text-slate-400">{hint}</p>
        </div>
        {canAdd ? (
          <button
            className="btn-primary shadow-sm shadow-indigo-500/30"
            onClick={() => router.push("/books/new")}
          >
            Add book
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="md:col-span-2">
          <label className="label text-slate-300">Search</label>
          <input
            className="input border-slate-600 bg-white text-black placeholder:text-slate-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, author, ISBN, category…"
          />
        </div>
        <div>
          <label className="label text-slate-300">Category</label>
          <input
            className="input border-slate-600 bg-white text-black placeholder:text-slate-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Fiction"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="text-sm text-slate-400">Loading books…</div>
        )}
        {error && (
          <div className="text-sm text-red-400">Error: {error}</div>
        )}
        {!loading &&
          !error &&
          filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40 transition-transform hover:-translate-y-0.5 hover:border-indigo-500/70 hover:shadow-indigo-900/40"
            >
              <div className="flex items-start gap-3">
                <BookCoverPlaceholder
                  letter={book.title.charAt(0) || "B"}
                  className="h-20 w-20 flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-50">
                        {book.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {book.author} • {book.category}
                      </div>
                    </div>
                    <span
                      className={[
                        "rounded-full px-2 py-1 text-xs font-medium",
                        book.availableCopies > 0
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-400/40"
                          : "bg-slate-700/60 text-slate-300 border border-slate-500/60"
                      ].join(" ")}
                    >
                      {book.availableCopies > 0 ? "Available" : "Unavailable"}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs text-slate-300">
                    {book.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-400">
                ISBN {book.isbn} • {book.publishedYear} • {book.availableCopies}{" "}
                of {book.totalCopies} available
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  className="btn-primary border-0 bg-indigo-600 px-3 py-1.5 text-xs shadow-sm shadow-indigo-500/30 disabled:opacity-60"
                  onClick={() => handleCheckout(book)}
                  disabled={book.availableCopies <= 0}
                >
                  Check out
                </button>
                {canEdit ? (
                  <button
                    className="btn-secondary border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-100"
                    onClick={() => handleEdit(book)}
                  >
                    Edit
                  </button>
                ) : null}
                {canDelete ? (
                  <button
                    className="btn-secondary border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-200"
                    onClick={() => handleDelete(book)}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Current filters: <span className="font-medium">{query || "—"}</span> /{" "}
        <span className="font-medium">{category || "—"}</span>
      </div>
    </div>
  );
}


