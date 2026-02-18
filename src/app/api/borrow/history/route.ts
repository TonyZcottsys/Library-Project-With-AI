import { prisma } from "@/lib/prisma";
import { jsonError, jsonOk } from "@/lib/api/route";
import { requireApiAuth } from "@/lib/auth/requireApiAuth";

export async function GET() {
  try {
    const session = await requireApiAuth();
    const userId = session.user.id;

    const records = await prisma.borrowRecord.findMany({
      where: { userId },
      include: {
        book: {
          select: { id: true, title: true, author: true, category: true, isbn: true }
        }
      },
      orderBy: { borrowDate: "desc" }
    });

    return jsonOk({ records });
  } catch (e) {
    return jsonError(e);
  }
}

