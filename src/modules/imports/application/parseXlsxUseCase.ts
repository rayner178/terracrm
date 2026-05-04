import ExcelJS from "exceljs";
import { ImportType, PreviewRow, ParseResult } from "../domain/ImportResult";
import {
  ProjectImportSchema,
  PROJECT_COLUMNS,
} from "./schemas/projectImportSchema";
import {
  VolunteerImportSchema,
  VOLUNTEER_COLUMNS,
} from "./schemas/volunteerImportSchema";
import {
  DonationImportSchema,
  DONATION_COLUMNS,
} from "./schemas/donationImportSchema";

const MAX_ROWS = 500;

const SCHEMAS = {
  projects:   { schema: ProjectImportSchema,  columns: PROJECT_COLUMNS },
  volunteers: { schema: VolunteerImportSchema, columns: VOLUNTEER_COLUMNS },
  donations:  { schema: DonationImportSchema,  columns: DONATION_COLUMNS },
} as const;

/** Convierte los errores de Zod en un mensaje de texto único y legible */
function humanizeZodErrors(errors: Record<string, string[]>): string {
  return Object.values(errors).flat().join(" · ");
}

export class ParseXlsxUseCase {
  async execute(buffer: Buffer, type: ImportType): Promise<ParseResult> {
    const { schema, columns } = SCHEMAS[type];

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("El archivo no contiene hojas de cálculo.");

    // Validate header row
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values as (string | undefined)[];
    // headers[0] is undefined (ExcelJS is 1-indexed)
    const headerValues = headers.slice(1).map((h) =>
      String(h ?? "").toLowerCase().trim()
    );

    for (const col of columns) {
      if (!headerValues.includes(col)) {
        throw new Error(
          `Columna requerida no encontrada: "${col}". Verifica que el archivo use las columnas correctas.`
        );
      }
    }

    // Build column index map
    const colIndex: Record<string, number> = {};
    headerValues.forEach((h, i) => { colIndex[h] = i + 1; }); // +1 for ExcelJS 1-based

    const dataRowCount = worksheet.rowCount - 1; // exclude header
    if (dataRowCount > MAX_ROWS) {
      throw new Error(
        `El archivo tiene ${dataRowCount} filas. El máximo permitido es ${MAX_ROWS}.`
      );
    }

    // Parse all rows to build preview (first 5)
    const preview: PreviewRow[] = [];

    for (let rowNum = 2; rowNum <= Math.min(6, worksheet.rowCount); rowNum++) {
      const row = worksheet.getRow(rowNum);
      const raw: Record<string, unknown> = {};

      for (const col of columns) {
        const idx = colIndex[col];
        const cell = row.getCell(idx);
        raw[col] = cell.value;
      }

      const parsed = schema.safeParse(raw);

      if (parsed.success) {
        preview.push({ row: rowNum - 1, data: raw, valid: true });
      } else {
        const errors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
        preview.push({
          row: rowNum - 1,
          data: raw,
          valid: false,
          error: humanizeZodErrors(errors),
        });
      }
    }

    // Serialize buffer for the confirmation step (as plain number array for JSON serialization)
    const rawBuffer = Array.from(buffer);

    return {
      type,
      totalRows: dataRowCount,
      preview,
      rawBuffer,
    };
  }
}
