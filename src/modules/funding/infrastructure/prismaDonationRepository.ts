import { prisma } from "@/infrastructure/database/prisma";
import { IDonationRepository, Donation } from "../domain/Donation";
import { DonationMapper } from "./DonationMapper";

export class PrismaDonationRepository implements IDonationRepository {
  async getAll(): Promise<Donation[]> {
    const donations = await prisma.donation.findMany({
      orderBy: { date: "desc" },
      include: {
        project: true
      }
    });
    return donations.map(DonationMapper.toDomain);
  }

  async findByStripeSessionId(sessionId: string): Promise<Donation | null> {
    const raw = await prisma.donation.findFirst({
      where: { stripeSessionId: sessionId },
    });
    return raw ? DonationMapper.toDomain(raw) : null;
  }

  async create(data: Omit<Donation, "id" | "date">): Promise<Donation> {
    const donation = await prisma.donation.create({
      data,
    });
    return DonationMapper.toDomain(donation);
  }
}
