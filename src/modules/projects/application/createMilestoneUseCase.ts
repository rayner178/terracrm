import { IMilestoneRepository, Milestone } from "../domain/Milestone";

export class CreateMilestoneUseCase {
  constructor(private milestoneRepository: IMilestoneRepository) {}

  async execute(data: {
    title: string;
    description?: string | null;
    dueDate?: Date | null;
    projectId: string;
  }): Promise<Milestone> {
    return this.milestoneRepository.create({
      title: data.title,
      description: data.description ?? null,
      dueDate: data.dueDate ?? null,
      status: "PENDING",
      projectId: data.projectId,
    });
  }
}
