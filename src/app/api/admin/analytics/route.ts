import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api/route";
import { requireApiAuth } from "@/lib/auth/requireApiAuth";

export async function GET() {
  try {
    const session = await requireApiAuth();
    // Only admins should see admin analytics; if not admin, return 403
    if (session.user.role !== "ADMIN") {
      return jsonError(
        new Error("Forbidden: admin analytics are restricted to ADMIN users.")
      );
    }

    const [totalBooks, activeBorrows, mostBorrowedAgg] = await Promise.all([
      prisma.book.count(),
      prisma.borrowRecord.count({ where: { status: "BORROWED" } }),
      prisma.borrowRecord.groupBy({
        by: ["bookId"],
        _count: { _all: true },
        orderBy: { _count: { id: "desc" } },
        take: 1
      })
    ]);

    let mostBorrowed: { title: string; count: number } | null = null;
    if (mostBorrowedAgg.length > 0) {
      const top = mostBorrowedAgg[0];
      const book = await prisma.book.findUnique({
        where: { id: top.bookId },
        select: { title: true }
      });
      if (book) {
        mostBorrowed = { title: book.title, count: top._count._all };
      }
    }

    return jsonOk({
      totalBooks,
      activeBorrows,
      mostBorrowed
    });
  } catch (e) {
    return jsonError(e);
  }
}

