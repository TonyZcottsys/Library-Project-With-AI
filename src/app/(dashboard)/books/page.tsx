import { requireAuth } from "@/lib/auth/requireAuth";
import { BooksPageClient } from "@/components/books/BooksPageClient";

export default async function BooksPage() {
  await requireAuth();
  return <BooksPageClient />;
}

