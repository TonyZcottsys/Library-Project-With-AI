import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      // When user just signed in, persist extra data on the token
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role ?? "MEMBER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) ?? (token.sub as string);
        session.user.role = (token.role as any) ?? "MEMBER";
      }
      return session;
    }
  }
};

