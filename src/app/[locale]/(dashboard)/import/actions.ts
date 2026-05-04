"use server";

import { container } from "@/core/di/registry";
import { validateXlsx } from "@/lib/validateFile";
import { ImportType, ParseResult, ImportResult } from "@/modules/imports/domain/ImportResult";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const ALLOWED_ROLES = ["SUPER_ADMIN", "DIRECTOR"];

async function guardRole() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/es/login");
  const role = (session.user as any)?.role;
  if (!ALLOWED_ROLES.includes(role)) redirect("/es");
}

/** Step 1 — parse the xlsx and return preview (first 5 rows + validation) */
export async function parseImportAction(
  formData: FormData
): Promise<{ success: true; data: ParseResult } | { success: false; error: string }> {
  await guardRole();
  try {
    const file = formData.get("file") as File;
    const type = formData.get("type") as ImportType;

    const validation = validateXlsx(file);
    if (!validation.valid) return { success: false, error: validation.error! };

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await container.parseXlsxUseCase.execute(buffer, type);
    return { success: true, data: result };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error al procesar el archivo." };
  }
}

/** Step 2 — confirm import of all valid rows */
export async function confirmImportAction(
  rawBuffer: number[],
  type: ImportType
): Promise<{ success: true; data: ImportResult } | { success: false; error: string }> {
  await guardRole();
  try {
    const buffer = Buffer.from(rawBuffer);
    const result = await container.importDataUseCase.execute(buffer, type);
    return { success: true, data: result };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "Error durante la importación." };
  }
}
