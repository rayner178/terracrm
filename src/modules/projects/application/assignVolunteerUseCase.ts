import { IProjectRepository } from "../domain/Project";

export class AssignVolunteerUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(projectId: string, volunteerId: string, hoursWorked: number = 0): Promise<void> {
    if (!projectId || !volunteerId) {
      throw new Error("Project ID and Volunteer ID are required");
    }
    await this.projectRepository.assignVolunteer(projectId, volunteerId, hoursWorked);
  }
}
