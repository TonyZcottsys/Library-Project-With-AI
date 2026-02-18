import { Errors } from "@/lib/api/errors";
import { getSession } from "@/lib/auth/serverSession";

export async function requireApiAuth() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw Errors.unauthorized();
  }
  return session;
}

