"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookIcon } from "@/components/icons/Icons";

type BookFormProps = {
  mode: "create" | "edit";
  initialBook?: {
    id: string;
    title: string;
    author: string;
    description: string;
    isbn: string;
    category: string;
    publishedYear: number;
    totalCopies: number;
  };
};

export function BookFormClient({ mode, initialBook }: BookFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialBook?.title ?? "");
  const [author, setAuthor] = useState(initialBook?.author ?? "");
  const [description, setDescription] = useState(
    initialBook?.description ?? ""
  );
  const [isbn, setIsbn] = useState(initialBook?.isbn ?? "");
  const [category, setCategory] = useState(initialBook?.category ?? "");
  const [publishedYear, setPublishedYear] = useState(
    initialBook ? String(initialBook.publishedYear) : ""
  );
  const [totalCopies, setTotalCopies] = useState(
    initialBook ? String(initialBook.totalCopies) : ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const year = Number.parseInt(publishedYear, 10);
    const total = Number.parseInt(totalCopies, 10);
    if (!Number.isFinite(year) || !Number.isFinite(total)) {
      setError("Published year and total copies must be numbers.");
      setSubmitting(false);
      return;
    }

    const payload = {
      title,
      author,
      description,
      isbn,
      category,
      publishedYear: year,
      totalCopies: total
    };

    const endpoint =
      mode === "create"
        ? "/api/books"
        : `/api/books/${initialBook?.id ?? ""}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      setError("Failed to save book.");
      setSubmitting(false);
      return;
    }

    router.push("/books");
    router.refresh();
  }

  const heading = mode === "create" ? "Add book" : "Edit book";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-4 shadow-xl shadow-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-sm">
            <BookIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-50">{heading}</h1>
            <p className="mt-1 text-sm text-slate-400">
              Fill out the details below to{" "}
              {mode === "create" ? "add a new" : "update this"} book.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30"
      >
        <div>
          <label className="label text-slate-300">Title</label>
          <input
            className="input border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label text-slate-300">Author</label>
          <input
            className="input border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label text-slate-300">Description</label>
          <textarea
            className="input min-h-[100px] border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label text-slate-300">ISBN</label>
            <input
              className="input border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label text-slate-300">Category</label>
            <input
              className="input border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label text-slate-300">Published year</label>
            <input
              className="input border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label text-slate-300">Total copies</label>
            <input
              className="input border-slate-700 bg-slate-950/70 text-slate-50 placeholder:text-slate-500"
              value={totalCopies}
              onChange={(e) => setTotalCopies(e.target.value)}
              required
            />
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="btn-primary border-0 bg-indigo-600 px-4 py-2 shadow-sm shadow-indigo-500/40"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="btn-secondary border-slate-700 bg-slate-900/80 text-slate-100"
            onClick={() => router.push("/books")}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

