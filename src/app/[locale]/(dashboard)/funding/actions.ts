"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/core/di/registry";

export async function fetchDonations() {
  return container.getDonationsUseCase.execute();
}

export async function fetchGrants() {
  return container.getGrantsUseCase.execute();
}

export async function fetchActiveProjects() {
  const projects = await container.getProjectsUseCase.execute();
  return projects.filter((p: any) => p.status !== "COMPLETED");
}

export async function createDonationAction(formData: FormData): Promise<any> {
  try {
    const data = {
      donorName: formData.get("donorName"),
      amount:    formData.get("amount"),
      projectId: formData.get("projectId"),
    };
    await container.createDonationUseCase.execute(data);
    revalidatePath("/funding");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}

export async function createGrantAction(formData: FormData): Promise<any> {
  try {
    const data = {
      donorName:    formData.get("donorName"),
      funderOrg:    formData.get("funderOrg"),
      amount:       formData.get("amount"),
      projectId:    formData.get("projectId"),
      notes:        formData.get("notes") || null,
      isRestricted: formData.get("isRestricted") === "true",
      currency:     formData.get("currency") || "USD",
    };
    await container.createGrantUseCase.execute(data);
    revalidatePath("/funding");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}
