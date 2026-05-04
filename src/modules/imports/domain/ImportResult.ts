/** Tipos de importación disponibles */
export type ImportType = "projects" | "volunteers" | "donations";

/** Error en una fila específica del Excel */
export interface RowError {
  row: number;    // número de fila (base 1, contando el header)
  data: unknown;  // datos crudos de la fila
  error: string;  // mensaje de error en lenguaje humano
}

/** Resultado de una fila durante el preview */
export interface PreviewRow {
  row: number;
  data: Record<string, unknown>;
  valid: boolean;
  error?: string;
}

/** Resultado final de la importación */
export interface ImportResult {
  type: ImportType;
  total: number;
  imported: number;
  failed: number;
  errors: RowError[];
}

/** Resultado del parseo previo (para preview) */
export interface ParseResult {
  type: ImportType;
  totalRows: number;         // total de filas de datos (sin header)
  preview: PreviewRow[];     // primeras 5 filas con validación
  rawBuffer: number[];       // buffer serializado para el paso de confirmación
}
