import { z } from "zod";

const VALID_STATUSES = ["PLANNING", "ACTIVE", "COMPLETED"] as const;

export const ProjectImportSchema = z.object({
  nombre:      z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  descripcion: z.string().optional().nullable(),
  ubicacion:   z.string().optional().nullable(),
  presupuesto: z.coerce
    .number({ error: "El presupuesto debe ser un número" })
    .nonnegative("El presupuesto no puede ser negativo")
    .optional(),
  estado: z.enum(VALID_STATUSES, {
    error: "El estado debe ser PLANNING, ACTIVE o COMPLETED",
  }).default("PLANNING"),
  fecha_inicio: z.any().optional().nullable(), // informativo, Project domain no tiene startDate
  fecha_fin:    z.any().optional().nullable(), // informativo
});

export type ProjectImportRow = z.infer<typeof ProjectImportSchema>;

export const PROJECT_COLUMNS = [
  "nombre",
  "descripcion",
  "ubicacion",
  "presupuesto",
  "estado",
  "fecha_inicio",
  "fecha_fin",
] as const;
