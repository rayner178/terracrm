export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Valida un archivo proveniente de un FormData (Next.js App Router / Edge)
 */
export function validateFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No se proporcionó ningún archivo." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "El archivo supera el tamaño máximo de 5MB." };
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "Tipo de archivo no permitido. Solo JPEG, PNG, WEBP y PDF." };
  }
  return { valid: true };
}

/**
 * Valida un archivo procesado como Buffer en el backend
 */
export function validateFileFromBuffer(buffer: Buffer, mimeType: string): FileValidationResult {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: "El buffer del archivo está vacío." };
  }
  if (buffer.length > MAX_FILE_SIZE) {
    return { valid: false, error: "El archivo supera el tamaño máximo de 5MB." };
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: "Tipo de archivo no permitido. Solo JPEG, PNG, WEBP y PDF." };
  }
  return { valid: true };
}
