import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { container } from "@/core/di/registry";
import { PdfGenerator } from "@/modules/reports/infrastructure/PdfGenerator";

import { withApiAuth } from "@/lib/withApiAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withApiAuth(async (req: NextRequest) => {

  try {
    const data = await container.getInstitutionalReportDataUseCase.execute();
    const stream = await PdfGenerator.generateImpactReport(data);

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="TerraCRM_Reporte_${new Date().toISOString().split('T')[0]}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return new NextResponse("Error generando PDF", { status: 500 });
  }
}, ["SUPER_ADMIN", "DIRECTOR", "AUDITOR", "TESORERO"]);
