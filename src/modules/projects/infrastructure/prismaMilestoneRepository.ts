import { prisma } from "@/infrastructure/database/prisma";
import { IMilestoneRepository, Milestone } from "../domain/Milestone";

export class PrismaMilestoneRepository implements IMilestoneRepository {
  async getByProjectId(projectId: string): Promise<Milestone[]> {
    return prisma.milestone.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });
  }

  async create(data: Omit<Milestone, "id" | "createdAt">): Promise<Milestone> {
    return prisma.milestone.create({ data });
  }

  async updateStatus(id: string, status: string): Promise<Milestone> {
    return prisma.milestone.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.milestone.delete({ where: { id } });
  }
}
