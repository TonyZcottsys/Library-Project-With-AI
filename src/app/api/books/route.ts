import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Errors } from "@/lib/api/errors";
import { jsonCreated, jsonError, jsonOk } from "@/lib/api/route";
import { requireApiAuth } from "@/lib/auth/requireApiAuth";
import type { Role } from "@/lib/auth/roles";

type BookPayload = {
  title: string;
  author: string;
  description: string;
  isbn: string;
  category: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies?: number;
};

const MUTATION_ROLES: Role[] = ["ADMIN", "LIBRARIAN"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const query = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;

    const books = await prisma.book.findMany({
      where: {
        AND: [
          query
            ? {
                OR: [
                  { title: { contains: query, mode: "insensitive" } },
                  { author: { contains: query, mode: "insensitive" } },
                  { isbn: { contains: query, mode: "insensitive" } },
                  { category: { contains: query, mode: "insensitive" } }
                ]
              }
            : {},
          category ? { category: { contains: category, mode: "insensitive" } } : {}
        ]
      },
      orderBy: { createdAt: "desc" }
    });

    return jsonOk({ books });
  } catch (e) {
    return jsonError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireApiAuth();
    const role = session.user?.role;
    if (!role || !MUTATION_ROLES.includes(role)) {
      return jsonError(Errors.forbidden());
    }

    const body = (await req.json()) as BookPayload;

    const {
      title,
      author,
      description,
      isbn,
      category,
      publishedYear,
      totalCopies,
      availableCopies
    } = body;

    if (!title || !author || !description || !isbn || !category) {
      return jsonError(Errors.badRequest("Missing required fields"));
    }
    if (!Number.isFinite(publishedYear) || !Number.isFinite(totalCopies)) {
      return jsonError(Errors.badRequest("Invalid numeric fields"));
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        description,
        isbn,
        category,
        publishedYear,
        totalCopies,
        availableCopies: availableCopies ?? totalCopies
      }
    });

    return jsonCreated({ book });
  } catch (e) {
    return jsonError(e);
  }
}

