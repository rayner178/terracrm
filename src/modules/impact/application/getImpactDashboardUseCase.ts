import { IImpactMetricRepository, MetricRecord, MetricDefinition } from "../domain/ImpactMetric";

export interface ImpactDashboardData {
  definitions: MetricDefinition[];
  records: MetricRecord[];
}

export class GetImpactDashboardUseCase {
  constructor(private repo: IImpactMetricRepository) {}

  async execute(projectId?: string): Promise<ImpactDashboardData> {
    // Retorna datos limpios de dominio (separación de responsabilidades: la UI los transforma para Recharts)
    const definitions = await this.repo.getDefinitions();
    const records = projectId 
      ? await this.repo.getRecordsByProject(projectId)
      : await this.repo.getAllRecords();

    return { definitions, records };
  }
}
