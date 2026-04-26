import { NextResponse } from "next/server";
import { container } from "@/core/di/registry";
import { checkRateLimit } from "@/infrastructure/redis/rateLimiter";

export async function GET(req: Request) {
  // 1. Rate Limiting
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await checkRateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  try {
    const data = await container.getPublicTransparencyDataUseCase.execute();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    if (error.message?.includes("No se detectó tenant_slug")) {
      return NextResponse.json({ error: "Tenant not found or invalid" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
