import { z } from "zod";
import { IDonationRepository } from "../domain/Donation";
import { ValidationError } from "@/core/errors/DomainError";

export const CreateDonationSchema = z.object({
  donorName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  amount: z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  projectId: z.string().optional().nullable().transform(val => val === "" ? null : val),
});

export class CreateDonationUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(data: unknown) {
    const parsed = CreateDonationSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError("Datos de donación inválidos", parsed.error.flatten().fieldErrors);
    }
    return await this.donationRepository.create({
      donorName:    parsed.data.donorName,
      amount:       parsed.data.amount,
      projectId:    parsed.data.projectId || undefined,
      locale:       "es",
      isRecurring:  false,
      type:         "DONATION",
      donorEmail:   null,
      notes:        null,
      currency:     "USD",
      isRestricted: false,
      funderOrg:    null,
    });
  }
}
