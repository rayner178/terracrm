"use server";

import { revalidatePath } from "next/cache";
import { PrismaProjectRepository } from "@/modules/projects/infrastructure/prismaProjectRepository";
import { GetProjectsUseCase } from "@/modules/projects/application/getProjectsUseCase";
import { CreateProjectUseCase } from "@/modules/projects/application/createProjectUseCase";
import { ActionResponse } from "@/core/types/ActionResponse";
import { ValidationError } from "@/core/errors/DomainError";

import { container } from "@/core/di/registry";

export async function fetchProjects() {
  return await container.getProjectsUseCase.execute();
}

export async function createProjectAction(formData: FormData): Promise<any> {
  try {
    const data = {
      name: formData.get("name"),
      description: formData.get("description") || null,
      location: formData.get("location") || null,
      status: formData.get("status") || "PLANNING",
    };

    await container.createProjectUseCase.execute(data);
    revalidatePath("/projects");
    return { success: true };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fieldErrors: error.details };
    }
    return { success: false, error: "Error interno" };
  }
}

export async function updateProjectStatusAction(formData: FormData) {
  const id = formData.get("id") as string;
  const status = formData.get("status") as string;

  await container.projectRepository.updateStatus(id, status);
  revalidatePath("/projects");
}
