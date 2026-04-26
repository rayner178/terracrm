import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { container } from "@/core/di/registry";
import { ExcelGenerator } from "@/modules/reports/infrastructure/ExcelGenerator";

import { withApiAuth } from "@/lib/withApiAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = withApiAuth(async (req: NextRequest) => {

  try {
    const data = await container.getInstitutionalReportDataUseCase.execute();
    const buffer = await ExcelGenerator.generateInstitutionalReport(data);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="TerraCRM_Finanzas_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel Generation Error:", error);
    return new NextResponse("Error generando Excel", { status: 500 });
  }
}, ["SUPER_ADMIN", "DIRECTOR", "AUDITOR", "TESORERO"]);
