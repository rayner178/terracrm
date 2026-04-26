import { IProjectRepository } from "../domain/Project";

export class GetProjectsUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute() {
    return await this.projectRepository.getAll();
  }
}
