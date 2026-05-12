import { Donation as PrismaDonation, Project as PrismaProject } from "@prisma/client";
import { Donation } from "../domain/Donation";

type PrismaDonationWithProject = PrismaDonation & { project?: PrismaProject | null };

export class DonationMapper {
  static toDomain(d: PrismaDonationWithProject): Donation {
    return {
      id: d.id,
      donorName: d.donorName,
      amount: d.amount,
      date: d.date,
      projectId: d.projectId || undefined,
      locale: d.locale,
      stripeSessionId: d.stripeSessionId,
      isRecurring: d.isRecurring,
      type: d.type,
      donorEmail: d.donorEmail,
      notes: d.notes,
      currency: d.currency,
      isRestricted: d.isRestricted,
      funderOrg: d.funderOrg,
    };
  }
}
