"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/core/di/registry";

export async function fetchProjects() {
  return container.getProjectsUseCase.execute();
}

export async function createProjectAction(formData: FormData): Promise<any> {
  try {
    const budgetRaw = formData.get("budget") as string;
    const startRaw = formData.get("startDate") as string;
    const endRaw = formData.get("endDate") as string;

    const data = {
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      location: (formData.get("location") as string) || null,
      ecosystemType: null,
      status: (formData.get("status") as string) || "PLANNING",
      budget: budgetRaw ? parseFloat(budgetRaw) : null,
      spent: null,
      startDate: startRaw ? new Date(startRaw) : null,
      endDate: endRaw ? new Date(endRaw) : null,
    };

    await container.createProjectUseCase.execute(data);
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}

export async function updateProjectStatusAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;
  await container.projectRepository.updateStatus(id, status);
  revalidatePath("/projects");
}
