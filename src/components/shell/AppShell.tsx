"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { canAccessRoute } from "@/lib/auth/permissions";
import {
  BookIcon,
  DashboardIcon,
  BorrowHistoryIcon,
  ChartIcon
} from "@/components/icons/Icons";

function NavItem({
  href,
  label,
  icon: Icon
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-200 hover:bg-slate-800 hover:text-slate-50"
      ].join(" ")}
    >
      <span className={active ? "text-white" : "text-slate-400"}>
        <Icon className="h-5 w-5" />
      </span>
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const role = data?.user?.role ?? "MEMBER";

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_50%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.14),transparent_55%)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/40 backdrop-blur">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.25),transparent_55%)]" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-sm">
                <BookIcon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-sm font-semibold text-slate-50">
                  Mini Library
                </div>
                <div className="text-xs text-slate-400">Role: {role}</div>
              </div>
            </div>
            <button
              className="btn-secondary border-slate-700 bg-slate-900/70 text-xs text-slate-100 hover:border-slate-500"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </div>
          <nav className="relative mt-5 flex flex-col gap-1">
            <NavItem href="/" label="Dashboard" icon={DashboardIcon} />
            <NavItem href="/books" label="Books" icon={BookIcon} />
            <NavItem href="/borrow-history" label="Borrow history" icon={BorrowHistoryIcon} />
            {canAccessRoute(role, "/admin/analytics") ? (
              <NavItem href="/admin/analytics" label="Admin analytics" icon={ChartIcon} />
            ) : null}
          </nav>
        </aside>
        <main className="min-w-0">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/40 backdrop-blur">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


