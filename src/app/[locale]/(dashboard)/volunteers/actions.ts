"use server";

import { revalidatePath } from "next/cache";
import { PrismaVolunteerRepository } from "@/modules/volunteers/infrastructure/prismaVolunteerRepository";
import { GetVolunteersUseCase } from "@/modules/volunteers/application/getVolunteersUseCase";
import { CreateVolunteerUseCase } from "@/modules/volunteers/application/createVolunteerUseCase";
import { ActionResponse } from "@/core/types/ActionResponse";
import { ValidationError } from "@/core/errors/DomainError";

import { container } from "@/core/di/registry";

export async function fetchVolunteers(page: number = 1) {
  return await container.getVolunteersUseCase.execute(page, 10);
}

export async function createVolunteerAction(formData: FormData): Promise<any> {
  try {
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone") || null,
      skills: formData.get("skills") || null,
    };

    await container.createVolunteerUseCase.execute(data);
    
    revalidatePath("/volunteers");
    return { success: true };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      return { success: false, error: error.message, fieldErrors: error.details };
    }
    return { success: false, error: error.message || "Error interno del servidor" };
  }
}
