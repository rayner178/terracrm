import { prisma } from "@/infrastructure/database/prisma";
import { IImpactMetricRepository, MetricDefinition, MetricRecord } from "../domain/ImpactMetric";
import { ImpactMapper } from "./ImpactMapper";

export class PrismaImpactRepository implements IImpactMetricRepository {
  async createDefinition(definition: Omit<MetricDefinition, "id" | "createdAt">): Promise<MetricDefinition> {
    const raw = await prisma.metricDefinition.create({ data: definition });
    return ImpactMapper.toDefinitionDomain(raw);
  }

  async getDefinitions(): Promise<MetricDefinition[]> {
    const raw = await prisma.metricDefinition.findMany({ orderBy: { category: "asc" } });
    return raw.map(ImpactMapper.toDefinitionDomain);
  }

  async createRecord(record: Omit<MetricRecord, "id" | "date">): Promise<MetricRecord> {
    const raw = await prisma.metricRecord.create({
      data: {
        value: record.value,
        metricDefinitionId: record.metricDefinitionId,
        projectId: record.projectId,
        recordedById: record.recordedById,
      },
    });
    return ImpactMapper.toRecordDomain(raw);
  }

  async getRecordsByProject(projectId: string): Promise<MetricRecord[]> {
    const raw = await prisma.metricRecord.findMany({
      where: { projectId },
      orderBy: { date: "asc" },
    });
    return raw.map(ImpactMapper.toRecordDomain);
  }

  async getAllRecords(): Promise<MetricRecord[]> {
    const raw = await prisma.metricRecord.findMany({
      orderBy: { date: "asc" },
    });
    return raw.map(ImpactMapper.toRecordDomain);
  }
}
