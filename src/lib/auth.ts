import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/infrastructure/database/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Select only needed fields — less data transferred from Supabase
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: { id: true, email: true, name: true, role: true, password: true, mustChangePassword: true }
        });

        if (!user) {
          // Constant-time dummy compare to prevent timing attacks even on miss
          await bcrypt.compare(credentials.password, '$2a$08$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
          return null;
        }

        // bcrypt rounds 8 = ~300ms on serverless vs ~1500ms with rounds 10
        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.mustChangePassword = (user as any).mustChangePassword;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).mustChangePassword = token.mustChangePassword;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,    // 8 hours — session expires after 8h of inactivity
    updateAge: 60 * 60,     // 1 hour  — JWT refreshed every hour for active sessions
  },
  pages: {
    signIn: "/es/login",
    error: "/es/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "supersecret123",
};
