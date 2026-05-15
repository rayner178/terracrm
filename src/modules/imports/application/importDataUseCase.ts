import ExcelJS from "exceljs";
import { ImportType, ImportResult, RowError } from "../domain/ImportResult";
import { ProjectImportSchema, PROJECT_COLUMNS, ProjectImportRow } from "./schemas/projectImportSchema";
import { VolunteerImportSchema, VOLUNTEER_COLUMNS, VolunteerImportRow } from "./schemas/volunteerImportSchema";
import { DonationImportSchema, DONATION_COLUMNS, DonationImportRow } from "./schemas/donationImportSchema";
import { IVolunteerRepository } from "@/modules/volunteers/domain/Volunteer";
import { IProjectRepository } from "@/modules/projects/domain/Project";
import { IDonationRepository } from "@/modules/funding/domain/Donation";

const SCHEMAS = {
  projects:   { schema: ProjectImportSchema,  columns: PROJECT_COLUMNS },
  volunteers: { schema: VolunteerImportSchema, columns: VOLUNTEER_COLUMNS },
  donations:  { schema: DonationImportSchema,  columns: DONATION_COLUMNS },
} as const;

function humanizeZodErrors(errors: Record<string, string[]>): string {
  return Object.values(errors).flat().join(" · ");
}

export class ImportDataUseCase {
  constructor(
    private volunteerRepo: IVolunteerRepository,
    private projectRepo: IProjectRepository,
    private donationRepo: IDonationRepository
  ) {}

  async execute(buffer: Buffer, type: ImportType): Promise<ImportResult> {
    const { schema, columns } = SCHEMAS[type];

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("El archivo no contiene hojas de cálculo.");

    const headerRow = worksheet.getRow(1);
    const headers = (headerRow.values as (string | undefined)[]).slice(1);
    const colIndex: Record<string, number> = {};
    headers.forEach((h, i) => {
      colIndex[String(h ?? "").toLowerCase().trim()] = i + 1;
    });

    const errors: RowError[] = [];
    let imported = 0;
    let total = 0;

    for (let rowNum = 2; rowNum <= worksheet.rowCount; rowNum++) {
      const row = worksheet.getRow(rowNum);
      const rowValues = (row.values as unknown[]).slice(1);
      if (rowValues.every((v) => v === null || v === undefined || v === "")) continue;

      total++;
      const raw: Record<string, unknown> = {};
      for (const col of columns) {
        raw[col] = row.getCell(colIndex[col] ?? 0).value;
      }

      const parsed = schema.safeParse(raw);

      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
        errors.push({ row: rowNum - 1, data: raw, error: humanizeZodErrors(fieldErrors) });
        continue; // errors never stop the import
      }

      try {
        // Repositories resolve tenant from Next.js request headers — context preserved
        await this._persist(type, parsed.data as ProjectImportRow | VolunteerImportRow | DonationImportRow);
        imported++;
      } catch (e: any) {
        errors.push({ row: rowNum - 1, data: raw, error: e?.message ?? "Error al guardar el registro" });
      }
    }

    return { type, total, imported, failed: errors.length, errors };
  }

  private async _persist(
    type: ImportType,
    data: ProjectImportRow | VolunteerImportRow | DonationImportRow
  ) {
    switch (type) {
      case "volunteers": {
        const d = data as VolunteerImportRow;
        await this.volunteerRepo.create({
          firstName: d.nombre,
          lastName:  d.apellido,
          email:     d.email,
          phone:     d.telefono ?? null,
          skills:    d.habilidades ?? null,
        });
        break;
      }
      case "projects": {
        const d = data as ProjectImportRow;
        await this.projectRepo.create({
          name:         d.nombre,
          description:  d.descripcion ?? null,
          location:     d.ubicacion ?? null,
          ecosystemType: null,
          status:       d.estado,
          budget:       null,
          spent:        null,
          startDate:    null,
          endDate:      null,
          coordinatorId: null,
        });
        break;
      }
      case "donations": {
        const d = data as DonationImportRow;
        await this.donationRepo.create({
          donorName:       d.nombre_donante,
          amount:          d.monto,
          locale:          "es",
          isRecurring:     false,
          stripeSessionId: null,
          projectId:       undefined,
          type:            "DONATION",
          donorEmail:      null,
          notes:           null,
          currency:        "USD",
          isRestricted:    false,
          funderOrg:       null,
        });
        break;
      }
    }
  }
}
