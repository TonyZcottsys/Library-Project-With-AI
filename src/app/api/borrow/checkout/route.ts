import { prisma } from "@/lib/prisma";
import { Errors } from "@/lib/api/errors";
import { jsonCreated, jsonError } from "@/lib/api/route";
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
      const book = await tx.book.findUnique({
        where: { id: bookId },
        select: { id: true, availableCopies: true, title: true }
      });
      if (!book) throw Errors.notFound("Book not found");
      if (book.availableCopies <= 0) throw Errors.conflict("No copies available");

      const existing = await tx.borrowRecord.findFirst({
        where: { userId, bookId, status: "BORROWED" },
        select: { id: true }
      });
      if (existing) throw Errors.conflict("You already borrowed this book");

      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } }
      });

      const record = await tx.borrowRecord.create({
        data: {
          userId,
          bookId,
          status: "BORROWED"
        }
      });

      return { record };
    });

    return jsonCreated(result);
  } catch (e) {
    return jsonError(e);
  }
}

