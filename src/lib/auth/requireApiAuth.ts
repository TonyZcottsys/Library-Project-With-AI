import type { Session } from "next-auth";
import { Errors } from "@/lib/api/errors";
import { getSession } from "@/lib/auth/serverSession";

export type SessionWithUser = Session & { user: NonNullable<Session["user"]> };

export async function requireApiAuth(): Promise<SessionWithUser> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw Errors.unauthorized();
  }
  return session as SessionWithUser;
}

