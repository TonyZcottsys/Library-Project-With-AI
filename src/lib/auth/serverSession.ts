import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextAuthOptions";

export function getSession() {
  return getServerSession(authOptions);
}

