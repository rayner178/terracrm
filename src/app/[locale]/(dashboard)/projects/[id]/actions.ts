"use server";

import { revalidatePath } from "next/cache";
import { container } from "@/core/di/registry";

export async function fetchProjectById(id: string) {
  return container.getProjectByIdUseCase.execute(id);
}

export async function createMilestoneAction(formData: FormData): Promise<any> {
  try {
    const projectId = formData.get("projectId") as string;
    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string) || null;
    const dueDateRaw = formData.get("dueDate") as string;
    const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

    if (!title) return { success: false, error: "El título es obligatorio" };
    await container.createMilestoneUseCase.execute({ title, description, dueDate, projectId });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}

export async function toggleMilestoneAction(formData: FormData): Promise<any> {
  try {
    const id = formData.get("id") as string;
    const currentStatus = formData.get("currentStatus") as string;
    const projectId = formData.get("projectId") as string;
    await container.toggleMilestoneUseCase.execute(id, currentStatus);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}

export async function deleteMilestoneAction(formData: FormData): Promise<any> {
  try {
    const id = formData.get("id") as string;
    const projectId = formData.get("projectId") as string;
    await container.deleteMilestoneUseCase.execute(id);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}
