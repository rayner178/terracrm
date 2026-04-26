import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { checkRateLimit } from "@/infrastructure/redis/rateLimiter";

export async function GET(req: Request) {
  // 1. Rate Limiting
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success } = await checkRateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
  }

  // 2. Fetch data (tenant injected safely by prisma extension because x-tenant-slug is in headers/middleware)
  try {
    const projects = await prisma.project.findMany({
      where: { status: "ACTIVE" },
      select: {
        id: true,
        name: true,
        description: true,
        ecosystemType: true,
        metricRecords: {
          select: {
            value: true,
            metricDefinitionId: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    if (error.message?.includes("No se detectó tenant_slug")) {
      return NextResponse.json({ error: "Tenant not found or invalid" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
