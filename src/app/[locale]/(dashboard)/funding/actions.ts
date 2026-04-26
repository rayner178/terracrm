"use server";

import { revalidatePath } from "next/cache";
import { PrismaDonationRepository } from "@/modules/funding/infrastructure/prismaDonationRepository";
import { GetDonationsUseCase } from "@/modules/funding/application/getDonationsUseCase";
import { CreateDonationUseCase } from "@/modules/funding/application/createDonationUseCase";
import { PrismaProjectRepository } from "@/modules/projects/infrastructure/prismaProjectRepository";
import { GetProjectsUseCase } from "@/modules/projects/application/getProjectsUseCase";
import { ActionResponse } from "@/core/types/ActionResponse";
import { ValidationError } from "@/core/errors/DomainError";

import { container } from "@/core/di/registry";

export async function fetchDonations() {
  return await container.getDonationsUseCase.execute();
}

export async function fetchActiveProjects() {
  const projects = await container.getProjectsUseCase.execute();
  return projects.filter(p => p.status !== "COMPLETED");
}

export async function createDonationAction(formData: FormData): Promise<any> {
  try {
    const data = {
      donorName: formData.get("donorName"),
      amount: formData.get("amount"),
      projectId: formData.get("projectId"),
    };

    await container.createDonationUseCase.execute(data);
    
    revalidatePath("/funding");
    return { success: true };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fieldErrors: error.details };
    }
    return { success: false, error: "Error interno" };
  }
}
