import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

import { NextResponse } from "next/server";
import { checkAuthRateLimit } from "@/infrastructure/redis/rateLimiter";

const handler = NextAuth(authOptions);

export async function POST(req: Request) {
  const url = new URL(req.url);
  // Apply rate limit ONLY to credentials login attempts
  if (url.pathname.endsWith("/callback/credentials")) {
    // Extract IP (works behind Vercel)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const { success } = await checkAuthRateLimit(ip);
    
    if (!success) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
  }
  
  return handler(req);
}

export { handler as GET };
