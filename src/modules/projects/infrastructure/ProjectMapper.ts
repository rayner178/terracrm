import { Project as PrismaProject } from "@prisma/client";
import { Project } from "../domain/Project";

export class ProjectMapper {
  static toDomain(prismaProject: PrismaProject): Project {
    return {
      id: prismaProject.id,
      name: prismaProject.name,
      description: prismaProject.description,
      location: prismaProject.location,
      status: prismaProject.status,
      createdAt: prismaProject.createdAt,
      updatedAt: prismaProject.updatedAt,
    };
  }
}
