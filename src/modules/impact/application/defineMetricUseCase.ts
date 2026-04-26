import { IImpactMetricRepository, MetricDefinition } from "../domain/ImpactMetric";
import { z } from "zod";
import { ValidationError } from "@/core/errors/DomainError";

const schema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  unit: z.string().min(1, "La unidad es obligatoria"),
  category: z.string().min(1, "La categoría es obligatoria"),
});

export class DefineMetricUseCase {
  constructor(private repo: IImpactMetricRepository) {}

  async execute(input: any): Promise<MetricDefinition> {
    const result = schema.safeParse(input);
    if (!result.success) throw new ValidationError(result.error.issues[0].message);

    return await this.repo.createDefinition(result.data);
  }
}
