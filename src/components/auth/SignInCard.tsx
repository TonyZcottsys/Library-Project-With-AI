"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { BookIcon } from "@/components/icons/Icons";

export function SignInCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
      redirect: false
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    if (res?.url) window.location.href = res.url;
  }

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/40">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-sm">
          <BookIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-50">Sign in</h1>
          <p className="mt-1 text-sm text-slate-400">
            Use your email and password, or Google, to access the library.
          </p>
        </div>
      </div>

      <form onSubmit={handleCredentialsSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium text-slate-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="••••••••"
            required
          />
        </div>
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full border-0 bg-indigo-600 py-2.5 text-sm font-medium shadow-sm shadow-indigo-500/40 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in with email"}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-700" />
        <span className="text-xs text-slate-500">or</span>
        <span className="h-px flex-1 bg-slate-700" />
      </div>

      <button
        type="button"
        className="btn-primary mt-4 w-full border border-slate-600 bg-slate-800/80 py-2.5 text-sm font-medium text-slate-200 hover:bg-slate-700/80"
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

