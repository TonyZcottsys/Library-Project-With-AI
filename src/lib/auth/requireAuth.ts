import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/serverSession";

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) redirect("/signin");
  return session;
}

