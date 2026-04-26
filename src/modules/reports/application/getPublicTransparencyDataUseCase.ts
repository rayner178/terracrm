import { IDonationRepository } from "@/modules/funding/domain/Donation";
import { IImpactMetricRepository } from "@/modules/impact/domain/ImpactMetric";
import { prisma } from "@/infrastructure/database/prisma";

export class GetPublicTransparencyDataUseCase {
  constructor(
    private donationRepo: IDonationRepository,
    private impactRepo: IImpactMetricRepository
  ) {}

  async execute() {
    // Obtenemos solo totales y definiciones, protegiendo PII (Personally Identifiable Information)
    const donations = await this.donationRepo.getAll();
    const metrics = await this.impactRepo.getAllRecords();
    const definitions = await this.impactRepo.getDefinitions();
    
    // Obtenemos conteo de proyectos (no la data interna sensible)
    const projectsCount = await prisma.project.count({
      where: { status: { in: ["ACTIVE", "COMPLETED"] } }
    });

    const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

    // Agregamos las métricas por definición para el frontend
    const aggregatedImpact = definitions.map(def => {
      const totalValue = metrics
        .filter(m => m.metricDefinitionId === def.id)
        .reduce((sum, m) => sum + m.value, 0);
      return {
        id: def.id,
        name: def.name,
        unit: def.unit,
        description: def.description,
        totalValue
      };
    }).filter(agg => agg.totalValue > 0);

    return {
      totalRaised,
      projectsCount,
      donationsCount: donations.length,
      impact: aggregatedImpact
    };
  }
}
