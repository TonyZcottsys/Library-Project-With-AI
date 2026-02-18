import { requireAuth } from "@/lib/auth/requireAuth";
import { AppShell } from "@/components/shell/AppShell";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <AppShell>{children}</AppShell>;
}

