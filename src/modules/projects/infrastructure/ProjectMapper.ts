import { Project as PrismaProject } from "@prisma/client";
import { Project } from "../domain/Project";

export class ProjectMapper {
  static toDomain(p: PrismaProject): Project {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      location: p.location,
      ecosystemType: p.ecosystemType,
      status: p.status,
      budget: p.budget,
      spent: p.spent,
      startDate: p.startDate,
      endDate: p.endDate,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      coordinatorId: p.coordinatorId,
    };
  }
}
