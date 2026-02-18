import { requireRole } from "@/lib/auth/requireRole";
import type { Role } from "@/lib/auth/roles";
import { BookFormClient } from "@/components/books/BookFormClient";

const ROLES: Role[] = ["ADMIN", "LIBRARIAN"];

export default async function NewBookPage() {
  await requireRole(ROLES);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <BookFormClient mode="create" />
      </div>
    </main>
  );
}

