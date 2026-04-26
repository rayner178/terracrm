import { prisma } from "@/infrastructure/database/prisma";
import { IVolunteerRepository, Volunteer } from "../domain/Volunteer";
import { VolunteerMapper } from "./VolunteerMapper";

export class PrismaVolunteerRepository implements IVolunteerRepository {
  async getAll(page: number = 1, limit: number = 10): Promise<{ data: Volunteer[], total: number }> {
    const skip = (page - 1) * limit;
    
    const [volunteers, total] = await Promise.all([
      prisma.volunteer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.volunteer.count()
    ]);

    return {
      data: volunteers.map(VolunteerMapper.toDomain),
      total
    };
  }

  async create(data: Omit<Volunteer, "id" | "createdAt" | "updatedAt">): Promise<Volunteer> {
    const volunteer = await prisma.volunteer.create({
      data,
    });
    return VolunteerMapper.toDomain(volunteer);
  }
}
