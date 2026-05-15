import { prisma } from "@/infrastructure/database/prisma";
import { IProjectRepository, Project, ProjectDetail } from "../domain/Project";
import { ProjectMapper } from "./ProjectMapper";

export class PrismaProjectRepository implements IProjectRepository {
  async getAll(): Promise<Project[]> {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return projects.map(ProjectMapper.toDomain);
  }

  async getById(id: string): Promise<ProjectDetail | null> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        assignments: {
          include: { volunteer: true },
        },
        donations: {
          orderBy: { date: "desc" },
        },
        metricRecords: {
          include: { metric: true },
          orderBy: { date: "asc" },
        },
        milestones: {
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!project) return null;
    return project as unknown as ProjectDetail;
  }

  async create(data: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    const project = await prisma.project.create({ data });
    return ProjectMapper.toDomain(project);
  }

  async updateStatus(id: string, status: string): Promise<Project> {
    const project = await prisma.project.update({
      where: { id },
      data: { status },
    });
    return ProjectMapper.toDomain(project);
  }

  async assignVolunteer(projectId: string, volunteerId: string, hoursWorked: number = 0): Promise<void> {
    await prisma.projectAssignment.upsert({
      where: {
        volunteerId_projectId: {
          volunteerId,
          projectId,
        },
      },
      create: {
        volunteerId,
        projectId,
        hoursWorked,
      },
      update: {
        hoursWorked: {
          increment: hoursWorked,
        },
      },
    });
  }
}
