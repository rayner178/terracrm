import { NextRequest, NextResponse } from "next/server";
import { container } from "@/core/di/registry";
import { PdfGenerator } from "@/modules/reports/infrastructure/PdfGenerator";
import { withApiAuth } from "@/lib/withApiAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withApiAuth(async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const project = await container.getProjectByIdUseCase.execute(params.id);
    if (!project) {
      return new NextResponse("Proyecto no encontrado", { status: 404 });
    }

    const stream = await PdfGenerator.generateProjectReport(project);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="TerraCRM_Proyecto_${project.name.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new NextResponse("Error generando PDF", { status: 500 });
  }
}, ["SUPER_ADMIN", "DIRECTOR", "AUDITOR", "TESORERO", "COORDINADOR"]);
