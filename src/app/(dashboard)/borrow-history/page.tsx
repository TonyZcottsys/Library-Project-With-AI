import { requireAuth } from "@/lib/auth/requireAuth";
import { BorrowHistoryClient } from "@/components/borrow/BorrowHistoryClient";

export default async function BorrowHistoryPage() {
  await requireAuth();
  return <BorrowHistoryClient />;
}

