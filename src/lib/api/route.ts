import { NextResponse } from "next/server";
import { isAppError } from "@/lib/api/errors";

export function jsonOk(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonCreated(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, { status: 201, ...init });
}

export function jsonNoContent() {
  return new NextResponse(null, { status: 204 });
}

export function jsonError(e: unknown) {
  if (isAppError(e)) {
    return NextResponse.json(
      { error: { code: e.code, message: e.message, details: e.details } },
      { status: e.status }
    );
  }

  return NextResponse.json(
    { error: { code: "INTERNAL", message: "Internal server error" } },
    { status: 500 }
  );
}

export async function parseJson<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

