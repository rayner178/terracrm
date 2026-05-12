import { z } from "zod";
import { IDonationRepository } from "../domain/Donation";
import { ValidationError } from "@/core/errors/DomainError";

export const CreateGrantSchema = z.object({
  donorName:    z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  funderOrg:    z.string().min(2, "El nombre de la organización es requerido"),
  amount:       z.coerce.number().min(0.01, "El monto debe ser mayor a 0"),
  projectId:    z.string().optional().nullable().transform(val => val === "" ? null : val),
  notes:        z.string().optional().nullable(),
  isRestricted: z.coerce.boolean().default(true),
  currency:     z.string().default("USD"),
});

export class CreateGrantUseCase {
  constructor(private donationRepository: IDonationRepository) {}

  async execute(data: unknown) {
    const parsed = CreateGrantSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError("Datos del grant inválidos", parsed.error.flatten().fieldErrors);
    }
    return this.donationRepository.create({
      donorName:    parsed.data.donorName,
      amount:       parsed.data.amount,
      projectId:    parsed.data.projectId || undefined,
      locale:       "es",
      isRecurring:  false,
      stripeSessionId: null,
      type:         "GRANT",
      donorEmail:   null,
      notes:        parsed.data.notes || null,
      currency:     parsed.data.currency,
      isRestricted: parsed.data.isRestricted,
      funderOrg:    parsed.data.funderOrg,
    });
  }
}
