import { prisma } from "@/infrastructure/database/prisma";
import { IProjectRepository, Project } from "../domain/Project";
import { ProjectMapper } from "./ProjectMapper";

export class PrismaProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects.map(ProjectMapper.toDomain);
  }

  async create(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const project = await prisma.project.create({
      data,
    });
    return ProjectMapper.toDomain(project);
  }

  async updateStatus(id: string, status: string): Promise<Project> {
    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });
    return ProjectMapper.toDomain(project);
  }
}
