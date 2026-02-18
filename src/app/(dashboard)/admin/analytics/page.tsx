import { requireRole } from "@/lib/auth/requireRole";
import { AdminAnalyticsClient } from "@/components/admin/AdminAnalyticsClient";

export default async function AdminAnalyticsPage() {
  await requireRole(["ADMIN"]);
  return <AdminAnalyticsClient />;
}

