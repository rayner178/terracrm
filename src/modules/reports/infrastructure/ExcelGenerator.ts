import * as ExcelJS from "exceljs";

export class ExcelGenerator {
  static async generateInstitutionalReport(data: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "TerraCRM";
    workbook.created = new Date();

    // Hoja de Finanzas
    const financeSheet = workbook.addWorksheet("Finanzas");
    financeSheet.columns = [
      { header: "ID", key: "id", width: 36 },
      { header: "Donante", key: "donor", width: 25 },
      { header: "Monto (USD)", key: "amount", width: 15 },
      { header: "Fecha", key: "date", width: 15 },
      { header: "Tipo", key: "type", width: 15 },
    ];
    financeSheet.getRow(1).font = { bold: true };

    data.donations.forEach((d: any) => {
      financeSheet.addRow({
        id: d.id,
        donor: d.donorName,
        amount: d.amount,
        date: new Date(d.date).toLocaleDateString(),
        type: d.isRecurring ? "Recurrente" : "Única"
      });
    });

    // Formato condicional básico para montos altos
    financeSheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const amount = row.getCell("amount").value as number;
        if (amount >= 1000) {
          row.getCell("amount").fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD4EDDA' } };
        }
      }
    });

    // Hoja de Impacto
    const impactSheet = workbook.addWorksheet("Impacto Consolidado");
    impactSheet.columns = [
      { header: "Métrica", key: "metric", width: 30 },
      { header: "Total Acumulado", key: "total", width: 20 },
      { header: "Unidad", key: "unit", width: 15 },
    ];
    impactSheet.getRow(1).font = { bold: true };

    data.definitions.forEach((def: any) => {
      const total = data.metrics
        .filter((m: any) => m.metricId === def.id)
        .reduce((sum: number, m: any) => sum + m.value, 0);

      if (total > 0) {
        impactSheet.addRow({
          metric: def.name,
          total: total,
          unit: def.unit
        });
      }
    });

    // Hoja de Proyectos
    const projectSheet = workbook.addWorksheet("Proyectos Activos");
    projectSheet.columns = [
      { header: "Nombre", key: "name", width: 30 },
      { header: "Estado", key: "status", width: 15 },
    ];
    projectSheet.getRow(1).font = { bold: true };
    data.projects.forEach((p: any) => {
      projectSheet.addRow({ name: p.name, status: p.status });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
