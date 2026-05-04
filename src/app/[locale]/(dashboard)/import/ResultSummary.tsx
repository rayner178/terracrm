import { ImportResult } from "@/modules/imports/domain/ImportResult";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface Props {
  result: ImportResult;
  onReset: () => void;
}

const TYPE_LABELS: Record<string, string> = {
  projects:   "Proyectos",
  volunteers: "Voluntarios",
  donations:  "Donaciones",
};

export function ResultSummary({ result, onReset }: Props) {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-5 text-center border border-slate-200">
          <p className="text-3xl font-bold text-slate-800">{result.total}</p>
          <p className="text-sm text-slate-500 mt-1">Total procesados</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-5 text-center border border-emerald-200">
          <p className="text-3xl font-bold text-emerald-600">{result.imported}</p>
          <p className="text-sm text-emerald-600 mt-1 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Importados
          </p>
        </div>
        <div className={`rounded-xl p-5 text-center border ${result.failed > 0 ? "bg-rose-50 border-rose-200" : "bg-slate-50 border-slate-200"}`}>
          <p className={`text-3xl font-bold ${result.failed > 0 ? "text-rose-500" : "text-slate-400"}`}>
            {result.failed}
          </p>
          <p className={`text-sm mt-1 flex items-center justify-center gap-1 ${result.failed > 0 ? "text-rose-500" : "text-slate-400"}`}>
            <XCircle className="w-4 h-4" /> Con errores
          </p>
        </div>
      </div>

      {/* Error detail */}
      {result.errors.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2 text-amber-700 font-medium">
            <AlertTriangle className="w-4 h-4" />
            Filas con errores — no fueron importadas
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="text-amber-700 uppercase">
                <tr>
                  <th className="py-1 pr-4 text-left">Fila</th>
                  <th className="py-1 text-left">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {result.errors.map((e) => (
                  <tr key={e.row}>
                    <td className="py-1 pr-4 font-mono text-amber-600">{e.row}</td>
                    <td className="py-1 text-amber-800">{e.error}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
      >
        Nueva Importación
      </button>
    </div>
  );
}
