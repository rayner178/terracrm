import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { checkAuthRateLimit } from "@/infrastructure/redis/rateLimiter";

const handler = NextAuth(authOptions);

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  // Apply rate limit ONLY to credentials login attempts
  if (url.pathname.endsWith("/callback/credentials")) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "anonymous";
    const { success } = await checkAuthRateLimit(ip);

    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
  }

  // Call NextAuth handler correctly in App Router — pass req and a mock context
  return (handler as any)(req, { params: { nextauth: url.pathname.split("/api/auth/")[1]?.split("/") ?? [] } });
}

export { handler as GET };
