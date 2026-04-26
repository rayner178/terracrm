import { IDonationRepository } from "@/modules/funding/domain/Donation";
import { IImpactMetricRepository } from "@/modules/impact/domain/ImpactMetric";
import { prisma } from "@/infrastructure/database/prisma";

export class GetInstitutionalReportDataUseCase {
  constructor(
    private donationRepo: IDonationRepository,
    private impactRepo: IImpactMetricRepository
  ) {}

  async execute() {
    const donations = await this.donationRepo.getAll();
    const metrics = await this.impactRepo.getAllRecords();
    const definitions = await this.impactRepo.getDefinitions();
    
    // Utilizamos prisma directamente para consultas complejas de agregación de reporte (patrón CQRS Read Model)
    const projects = await prisma.project.findMany({
      include: {
        donations: true,
        metricRecords: true,
      }
    });

    return {
      projects,
      donations,
      metrics,
      definitions,
      totalRaised: donations.reduce((sum, d) => sum + d.amount, 0),
    };
  }
}
