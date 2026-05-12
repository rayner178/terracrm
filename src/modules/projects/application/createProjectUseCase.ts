import { z } from "zod";
import { IProjectRepository } from "../domain/Project";
import { ValidationError } from "@/core/errors/DomainError";

export const CreateProjectSchema = z.object({
  name:          z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  description:   z.string().optional().nullable(),
  location:      z.string().optional().nullable(),
  ecosystemType: z.string().optional().nullable(),
  status:        z.enum(["PLANNING", "ACTIVE", "COMPLETED"]).default("PLANNING"),
  budget:        z.coerce.number().optional().nullable(),
  spent:         z.coerce.number().optional().nullable(),
  startDate:     z.coerce.date().optional().nullable(),
  endDate:       z.coerce.date().optional().nullable(),
});

export class CreateProjectUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(data: unknown) {
    const parsed = CreateProjectSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError("Datos de proyecto inválidos", parsed.error.flatten().fieldErrors);
    }
    return await this.projectRepository.create({
      name:          parsed.data.name,
      description:   parsed.data.description || null,
      location:      parsed.data.location || null,
      ecosystemType: parsed.data.ecosystemType || null,
      status:        parsed.data.status,
      budget:        parsed.data.budget ?? null,
      spent:         parsed.data.spent ?? null,
      startDate:     parsed.data.startDate ?? null,
      endDate:       parsed.data.endDate ?? null,
    });
  }
}
