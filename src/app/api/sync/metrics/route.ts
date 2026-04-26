import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/database/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { metrics } = body;

    if (!Array.isArray(metrics) || metrics.length === 0) {
      return NextResponse.json({ success: true, synced: 0 });
    }

    // Leemos el tenant que el middleware inyectó (basado en el host)
    // El middleware.ts lo pone en el request original, pero en Route Handlers 
    // tenemos que extraerlo de los headers.
    const tenantSlug = req.headers.get("x-tenant-slug");

    if (!tenantSlug) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 400 });
    }

    // Verificación de seguridad: asegurarnos que las métricas encoladas por la PWA
    // correspondan al tenant real donde está logueado el usuario.
    const validMetrics = metrics.filter(m => m.tenantSlug === tenantSlug);

    if (validMetrics.length === 0) {
      return NextResponse.json({ error: "No valid metrics for this tenant" }, { status: 403 });
    }

    // Insertar usando el cliente prisma extendido (aislado)
    // Prisma ya inyectará automáticamente el search_path porque
    // leerá el header x-tenant-slug a través del contexto en getTenantSlug()
    
    // Batch create
    await prisma.metricRecord.createMany({
      data: validMetrics.map(m => ({
        metricDefinitionId: m.metricDefinitionId,
        projectId: m.projectId,
        value: m.value,
        date: new Date(m.date),
        recordedById: (session.user as any).id // Forzamos el ID real de la sesión
      }))
    });

    return NextResponse.json({ success: true, synced: validMetrics.length });

  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
