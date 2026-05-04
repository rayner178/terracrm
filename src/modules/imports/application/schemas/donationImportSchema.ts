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

export const DonationImportSchema = z.object({
  nombre_donante: z.string().min(2, "El nombre del donante debe tener al menos 2 caracteres"),
  email:          z.string().email("El email no tiene un formato válido"),
  monto: z.coerce
    .number({ error: "El monto debe ser un número" })
    .positive("El monto debe ser mayor a cero"),
  fecha:          excelDate,
  proyecto:       z.string().optional().nullable(),
  notas:          z.string().optional().nullable(),
});

export type DonationImportRow = z.infer<typeof DonationImportSchema>;

export const DONATION_COLUMNS = [
  "nombre_donante",
  "email",
  "monto",
  "fecha",
  "proyecto",
  "notas",
] as const;
