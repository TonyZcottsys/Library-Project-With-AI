import { requireAuth } from "@/lib/auth/requireAuth";
import { DashboardCards } from "@/components/dashboard/DashboardCards";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  await requireAuth();

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

  return (
    <div className="p-5">
      <h1 className="text-lg font-semibold text-slate-50">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-300">
        Welcome to the Mini Library Management System.
      </p>
      <div className="mt-6">
        <DashboardCards
          totalBooks={totalBooks}
          activeBorrows={activeBorrows}
          mostBorrowed={mostBorrowed}
        />
      </div>
    </div>
  );
}

