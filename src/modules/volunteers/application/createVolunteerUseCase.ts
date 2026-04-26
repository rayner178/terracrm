import { z } from "zod";
import { IVolunteerRepository } from "../domain/Volunteer";
import { ValidationError } from "@/core/errors/DomainError";

export const CreateVolunteerSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional().nullable(),
  skills: z.string().optional().nullable(),
});

export type CreateVolunteerDTO = z.infer<typeof CreateVolunteerSchema>;

export class CreateVolunteerUseCase {
  constructor(private volunteerRepository: IVolunteerRepository) {}

  async execute(data: unknown) {
    const parsed = CreateVolunteerSchema.safeParse(data);
    
    if (!parsed.success) {
      throw new ValidationError("Datos de voluntario inválidos", parsed.error.flatten().fieldErrors);
    }
    
    return await this.volunteerRepository.create({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      skills: parsed.data.skills || null
    });
  }
}
