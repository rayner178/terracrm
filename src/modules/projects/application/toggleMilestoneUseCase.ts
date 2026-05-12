import { IMilestoneRepository } from "../domain/Milestone";

export class ToggleMilestoneUseCase {
  constructor(private milestoneRepository: IMilestoneRepository) {}

  async execute(id: string, currentStatus: string): Promise<void> {
    const newStatus = currentStatus === "COMPLETED" ? "PENDING" : "COMPLETED";
    await this.milestoneRepository.updateStatus(id, newStatus);
  }
}
