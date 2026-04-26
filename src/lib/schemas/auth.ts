import { z } from "zod";

/**
 * Esquema reutilizable para validación de contraseñas.
 * Reglas: mínimo 8 caracteres, al menos 1 mayúscula, al menos 1 número.
 */
export const passwordSchema = z.string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número");

export const changePasswordSchema = z.object({
  newPassword: passwordSchema,
});
