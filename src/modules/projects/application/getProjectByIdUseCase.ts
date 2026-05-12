import { IProjectRepository, ProjectDetail } from "../domain/Project";

export class GetProjectByIdUseCase {
  constructor(private projectRepository: IProjectRepository) {}

  async execute(id: string): Promise<ProjectDetail | null> {
    return this.projectRepository.getById(id);
  }
}
