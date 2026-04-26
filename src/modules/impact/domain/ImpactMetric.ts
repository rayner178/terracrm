export interface MetricDefinition {
  id: string;
  name: string;
  unit: string;
  category: string;
  description?: string | null;
  createdAt: Date;
}

export interface MetricRecord {
  id: string;
  metricDefinitionId: string;
  projectId?: string;
  recordedById: string;
  value: number;
  date: Date;
}

export interface IImpactMetricRepository {
  createDefinition(definition: Omit<MetricDefinition, "id" | "createdAt">): Promise<MetricDefinition>;
  getDefinitions(): Promise<MetricDefinition[]>;
  createRecord(record: Omit<MetricRecord, "id" | "date">): Promise<MetricRecord>;
  getRecordsByProject(projectId: string): Promise<MetricRecord[]>;
  getAllRecords(): Promise<MetricRecord[]>;
}
