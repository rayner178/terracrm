import { prisma } from "@/infrastructure/database/prisma";
import { IDonationRepository, Donation } from "../domain/Donation";
import { DonationMapper } from "./DonationMapper";

export class PrismaDonationRepository implements IDonationRepository {
  async getAll(filters?: { projectId?: string; startDate?: Date; endDate?: Date; type?: string }): Promise<Donation[]> {
    const where: any = {};
    if (filters?.projectId) where.projectId = filters.projectId;
    if (filters?.type) where.type = filters.type;
    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }
    const donations = await prisma.donation.findMany({
      where,
      orderBy: { date: "desc" },
      include: { project: true },
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
    const donation = await prisma.donation.create({ data });
    return DonationMapper.toDomain(donation);
  }
}
