import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth/requireRole";
import type { Role } from "@/lib/auth/roles";
import { BookFormClient } from "@/components/books/BookFormClient";

const ROLES: Role[] = ["ADMIN"];

export default async function EditBookPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(ROLES);
  const { id } = await params;

  const book = await prisma.book.findUnique({
    where: { id }
  });

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BookFormClient
          mode="edit"
          initialBook={{
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            isbn: book.isbn,
            category: book.category,
            publishedYear: book.publishedYear,
            totalCopies: book.totalCopies
          }}
        />
      </div>
    </main>
  );
}

