import { IImpactMetricRepository, MetricRecord } from "../domain/ImpactMetric";
import { z } from "zod";
import { ValidationError } from "@/core/errors/DomainError";

const schema = z.object({
  metricDefinitionId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
  recordedById: z.string().uuid(),
  value: z.number().positive("El valor debe ser positivo"),
  userRole: z.enum(["SUPER_ADMIN", "DIRECTOR", "COORDINADOR", "TESORERO", "AUDITOR"]).optional(),
});

export class RecordMetricUseCase {
  constructor(private repo: IImpactMetricRepository) {}

  async execute(input: any): Promise<MetricRecord> {
    const result = schema.safeParse(input);
    if (!result.success) throw new ValidationError(result.error.issues[0].message);

    const { userRole, ...dataToSave } = result.data;
    if (userRole === "TESORERO" || userRole === "AUDITOR") {
      throw new ValidationError("Acceso denegado: Rol sin permisos de escritura en métricas.");
    }

    return await this.repo.createRecord(dataToSave);
  }
}
