import type { Role } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/serverSession";
import { hasPermission, type Permission } from "@/lib/auth/permissions";
import { Errors } from "@/lib/api/errors";

export type ApiActor = {
  userId: string;
  role: Role;
  email?: string | null;
};

export async function requireApiActor(): Promise<ApiActor> {
  const session = await getSession();
  if (!session?.user) throw Errors.unauthorized();
  return { userId: session.user.id, role: session.user.role, email: session.user.email };
}

export async function requirePermission(permission: Permission): Promise<ApiActor> {
  const actor = await requireApiActor();
  if (!hasPermission(actor.role, permission)) throw Errors.forbidden();
  return actor;
}

