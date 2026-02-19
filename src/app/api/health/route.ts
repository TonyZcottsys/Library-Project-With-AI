import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const [totalBooks, totalBorrows] = await Promise.all([
      prisma.book.count(),
      prisma.borrowRecord.count()
    ]);
    return NextResponse.json({
      ok: true,
      database: "connected",
      totalBooks,
      totalBorrows
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database connection failed";
    return NextResponse.json(
      { ok: false, database: "error", error: message },
      { status: 503 }
    );
  }
}

