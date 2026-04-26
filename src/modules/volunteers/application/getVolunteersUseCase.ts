import { IVolunteerRepository } from "../domain/Volunteer";
import { PaginatedResult } from "@/core/types/PaginatedResult";
import { Volunteer } from "../domain/Volunteer";

export class GetVolunteersUseCase {
  constructor(private volunteerRepository: IVolunteerRepository) {}

  async execute(page: number = 1, limit: number = 10): Promise<PaginatedResult<Volunteer>> {
    const { data, total } = await this.volunteerRepository.getAll(page, limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
