import { IProjectRepository } from "@/modules/projects/domain/Project";
import { IDonationRepository } from "@/modules/funding/domain/Donation";
import { IVolunteerRepository } from "@/modules/volunteers/domain/Volunteer";
import { ImpactMetrics } from "../domain/ImpactMetrics";

export class GetGeneralImpactUseCase {
  constructor(
    private projectRepo: IProjectRepository,
    private donationRepo: IDonationRepository,
    private volunteerRepo: IVolunteerRepository
  ) {}

  async execute(): Promise<ImpactMetrics> {
    const [projects, donations, volunteersResult] = await Promise.all([
      this.projectRepo.getAll(),
      this.donationRepo.getAll(),
      this.volunteerRepo.getAll(1, 1) // limit 1 since we only need the total count
    ]);

    const totalFundsRaised = donations.reduce((acc, d) => acc + d.amount, 0);
    const fundsAllocatedToProjects = donations
      .filter(d => d.projectId !== null)
      .reduce((acc, d) => acc + d.amount, 0);
    
    return {
      totalFundsRaised,
      fundsAllocatedToProjects,
      generalFundBalance: totalFundsRaised - fundsAllocatedToProjects,
      projectsStatusDistribution: {
        planning: projects.filter(p => p.status === "PLANNING").length,
        active: projects.filter(p => p.status === "ACTIVE").length,
        completed: projects.filter(p => p.status === "COMPLETED").length,
      },
      volunteersGrowth: volunteersResult.total
    };
  }
}
