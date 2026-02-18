import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Errors } from "@/lib/api/errors";
import { jsonError, jsonNoContent, jsonOk } from "@/lib/api/route";
import { requireApiAuth } from "@/lib/auth/requireApiAuth";
import type { Role } from "@/lib/auth/roles";

type BookPayload = {
  title?: string;
  author?: string;
  description?: string;
  isbn?: string;
  category?: string;
  publishedYear?: number;
  totalCopies?: number;
  availableCopies?: number;
};

const UPDATE_ROLES: Role[] = ["ADMIN"];
const DELETE_ROLES: Role[] = ["ADMIN"];

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth();
    const role = session.user?.role;
    if (!role || !UPDATE_ROLES.includes(role)) {
      return jsonError(Errors.forbidden());
    }

    const body = (await req.json()) as BookPayload;
    const { id } = await params;

    const book = await prisma.book.update({
      where: { id },
      data: body
    });

    return jsonOk({ book });
  } catch (e) {
    return jsonError(e);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireApiAuth();
    const role = session.user?.role;
    if (!role || !DELETE_ROLES.includes(role)) {
      return jsonError(Errors.forbidden());
    }

    const { id } = await params;
    await prisma.book.delete({
      where: { id }
    });

    return jsonNoContent();
  } catch (e) {
    return jsonError(e);
  }
}

