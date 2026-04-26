"use server";

import { container } from "@/core/di/registry";
import { withAuditLog } from "@/core/auth/auditMiddleware";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const recordMetricAction = withAuditLog(
  { action: "UPDATE", entity: "PROJECT", requiredPermission: "manage:projects" },
  async (formData: FormData) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("No autorizado");

    const data = {
      metricDefinitionId: formData.get("metricId"),
      projectId: formData.get("projectId") || undefined,
      value: Number(formData.get("value")),
      recordedById: (session.user as any).id,
      userRole: (session.user as any).role,
    };

    await container.recordMetricUseCase.execute(data);
    revalidatePath("/[locale]/impact", "page");
    return { success: true };
  }
);
