import { IMilestoneRepository } from "../domain/Milestone";

export class DeleteMilestoneUseCase {
  constructor(private milestoneRepository: IMilestoneRepository) {}

  async execute(id: string): Promise<void> {
    await this.milestoneRepository.delete(id);
  }
}
