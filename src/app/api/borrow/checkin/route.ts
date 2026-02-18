import { prisma } from "@/lib/prisma";
import { Errors } from "@/lib/api/errors";
import { jsonOk, jsonError } from "@/lib/api/route";
import { requireApiAuth } from "@/lib/auth/requireApiAuth";

type Body = { bookId?: string };

export async function POST(req: Request) {
  try {
    const session = await requireApiAuth();
    const userId = session.user.id;

    const body = (await req.json()) as Body;
    const bookId = body.bookId;
    if (!bookId) return jsonError(Errors.badRequest("bookId is required"));

    const result = await prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findFirst({
        where: { userId, bookId, status: "BORROWED" },
        orderBy: { borrowDate: "desc" }
      });

      if (!record) throw Errors.badRequest("No active borrow record found");

      const updated = await tx.borrowRecord.update({
        where: { id: record.id },
        data: {
          status: "RETURNED",
          returnDate: new Date()
        }
      });

      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: { increment: 1 } }
      });

      return { record: updated };
    });

    return jsonOk(result);
  } catch (e) {
    return jsonError(e);
  }
}

