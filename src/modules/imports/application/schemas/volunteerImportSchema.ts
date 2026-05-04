import { z } from "zod";

const excelDate = z.union([
  z.string().min(1, "La fecha no puede estar vacía"),
  z.number(),
  z.date(),
]).transform((val) => {
  if (val instanceof Date) return val;
  if (typeof val === "number") {
    return new Date((val - 25569) * 86400 * 1000);
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) throw new Error("Fecha inválida");
  return d;
});

export const VolunteerImportSchema = z.object({
  nombre:          z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido:        z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email:           z.string().email("El email no tiene un formato válido"),
  telefono:        z.string().optional().nullable(),
  habilidades:     z.string().optional().nullable(),
  fecha_registro:  excelDate.optional().nullable(),
});

export type VolunteerImportRow = z.infer<typeof VolunteerImportSchema>;

export const VOLUNTEER_COLUMNS = [
  "nombre",
  "apellido",
  "email",
  "telefono",
  "habilidades",
  "fecha_registro",
] as const;
