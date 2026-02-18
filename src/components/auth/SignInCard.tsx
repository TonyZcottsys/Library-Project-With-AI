"use client";

import { signIn } from "next-auth/react";
import { BookIcon } from "@/components/icons/Icons";

export function SignInCard() {
  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-sm">
          <BookIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Sign in</h1>
          <p className="mt-1 text-sm text-slate-400">
            Use Google SSO to access your library dashboard.
          </p>
        </div>
      </div>
      <button
        className="btn-primary mt-6 w-full border-0 bg-indigo-600 py-2.5 text-sm font-medium shadow-sm shadow-indigo-500/40"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Continue with Google
      </button>
      <div className="mt-4 text-xs text-slate-500">
        Your role is assigned in the database (default: MEMBER).
      </div>
    </div>
  );
}

