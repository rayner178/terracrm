import { PreviewRow } from "@/modules/imports/domain/ImportResult";
import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  preview: PreviewRow[];
  totalRows: number;
}

export function PreviewTable({ preview, totalRows }: Props) {
  const columns = preview.length > 0 ? Object.keys(preview[0].data) : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Mostrando <strong>{preview.length}</strong> de <strong>{totalRows}</strong> filas
        </span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            {preview.filter((r) => r.valid).length} válidas
          </span>
          <span className="flex items-center gap-1 text-rose-500">
            <XCircle className="w-4 h-4" />
            {preview.filter((r) => !r.valid).length} con errores
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-3 py-3 text-left w-10">#</th>
              {columns.map((col) => (
                <th key={col} className="px-3 py-3 text-left whitespace-nowrap">
                  {col}
                </th>
              ))}
              <th className="px-3 py-3 text-left">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {preview.map((row) => (
              <tr
                key={row.row}
                className={row.valid ? "bg-white" : "bg-rose-50"}
              >
                <td className="px-3 py-2 text-slate-400 font-mono text-xs">{row.row}</td>
                {columns.map((col) => (
                  <td key={col} className="px-3 py-2 text-slate-700 max-w-[160px] truncate">
                    {String(row.data[col] ?? "—")}
                  </td>
                ))}
                <td className="px-3 py-2">
                  {row.valid ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Válida
                    </span>
                  ) : (
                    <span
                      className="inline-flex items-center gap-1 text-rose-500 text-xs font-medium"
                      title={row.error}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span className="max-w-[200px] truncate">{row.error}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
