import { MetricDefinition as PrismaMetricDef, MetricRecord as PrismaMetricRecord } from "@prisma/client";
import { MetricDefinition, MetricRecord } from "../domain/ImpactMetric";

export class ImpactMapper {
  static toDefinitionDomain(raw: PrismaMetricDef): MetricDefinition {
    return {
      id: raw.id,
      name: raw.name,
      unit: raw.unit,
      category: raw.category,
      description: raw.description,
      createdAt: raw.createdAt,
    };
  }

  static toRecordDomain(raw: PrismaMetricRecord): MetricRecord {
    return {
      id: raw.id,
      metricDefinitionId: (raw as any).metricDefinitionId || (raw as any).metricId,
      projectId: raw.projectId || undefined,
      recordedById: raw.recordedById,
      value: raw.value,
      date: raw.date,
    };
  }
}
