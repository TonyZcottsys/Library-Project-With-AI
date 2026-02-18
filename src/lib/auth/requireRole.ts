import { redirect } from "next/navigation";
import type { Role } from "@/lib/auth/roles";
import { getSession } from "@/lib/auth/serverSession";

export async function requireRole(roles: Role[]) {
  const session = await getSession();
  const role = session?.user?.role;
  if (!session?.user) redirect("/signin");
  if (!role || !roles.includes(role)) redirect("/");
  return session;
}

