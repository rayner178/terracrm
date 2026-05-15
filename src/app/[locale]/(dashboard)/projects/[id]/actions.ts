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

export async function assignVolunteerAction(formData: FormData): Promise<any> {
  try {
    const projectId = formData.get("projectId") as string;
    const volunteerId = formData.get("volunteerId") as string;
    const hoursRaw = formData.get("hoursWorked") as string;
    const hoursWorked = hoursRaw ? parseInt(hoursRaw) : 0;
    
    await container.assignVolunteerUseCase.execute(projectId, volunteerId, hoursWorked);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function recordProjectMetricAction(formData: FormData): Promise<any> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) throw new Error("No autorizado");

    const data = {
      metricDefinitionId: formData.get("metricDefinitionId") as string,
      projectId: formData.get("projectId") as string,
      value: Number(formData.get("value")),
      recordedById: (session.user as any).id,
      userRole: (session.user as any).role,
    };

    await container.recordMetricUseCase.execute(data);
    revalidatePath(`/projects/${data.projectId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}

import { prisma } from "@/infrastructure/database/prisma";

export async function fetchCoordinators() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" }
  });
}

export async function updateCoordinatorAction(formData: FormData): Promise<any> {
  try {
    const id = formData.get("projectId") as string;
    const coordinatorId = formData.get("coordinatorId") as string;
    await container.projectRepository.updateCoordinator(id, coordinatorId);
    revalidatePath(`/projects/${id}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Error interno" };
  }
}
