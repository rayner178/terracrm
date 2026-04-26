import { Donation as PrismaDonation, Project as PrismaProject } from "@prisma/client";
import { Donation } from "../domain/Donation";

type PrismaDonationWithProject = PrismaDonation & { project?: PrismaProject | null };

export class DonationMapper {
  static toDomain(prismaDonation: PrismaDonationWithProject): Donation {
    return {
      id: prismaDonation.id,
      donorName: prismaDonation.donorName,
      amount: prismaDonation.amount,
      date: prismaDonation.date,
      projectId: prismaDonation.projectId || undefined,
      locale: prismaDonation.locale,
      stripeSessionId: prismaDonation.stripeSessionId,
      isRecurring: prismaDonation.isRecurring,
    };
  }
}
