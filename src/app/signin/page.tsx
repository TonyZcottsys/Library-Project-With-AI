import { SignInCard } from "@/components/auth/SignInCard";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-lg items-center px-4 py-10">
        <SignInCard />
      </div>
    </main>
  );
}

