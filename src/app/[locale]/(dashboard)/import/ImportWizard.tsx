"use client";

import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, ChevronRight, Loader2 } from "lucide-react";
import { ImportType, ParseResult, ImportResult } from "@/modules/imports/domain/ImportResult";
import { parseImportAction, confirmImportAction } from "./actions";
import { PreviewTable } from "./PreviewTable";
import { ResultSummary } from "./ResultSummary";

type Step = "upload" | "preview" | "importing" | "done";

const TYPE_OPTIONS: { value: ImportType; label: string; columns: string }[] = [
  {
    value: "volunteers",
    label: "Voluntarios",
    columns: "nombre · apellido · email · telefono · habilidades · fecha_registro",
  },
  {
    value: "projects",
    label: "Proyectos",
    columns: "nombre · descripcion · ubicacion · presupuesto · estado · fecha_inicio · fecha_fin",
  },
  {
    value: "donations",
    label: "Donaciones históricas",
    columns: "nombre_donante · email · monto · fecha · proyecto · notas",
  },
];

export function ImportWizard() {
  const [step, setStep] = useState<Step>("upload");
  const [type, setType] = useState<ImportType>("volunteers");
  const [error, setError] = useState("");
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type);

    setStep("importing"); // show spinner during parse
    const res = await parseImportAction(fd);

    if (!res.success) {
      setError(res.error);
      setStep("upload");
      return;
    }
    setParseResult(res.data);
    setStep("preview");
  }

  async function handleConfirm() {
    if (!parseResult) return;
    setStep("importing");
    const res = await confirmImportAction(parseResult.rawBuffer, parseResult.type);
    if (!res.success) {
      setError(res.error);
      setStep("preview");
      return;
    }
    setImportResult(res.data);
    setStep("done");
  }

  function handleReset() {
    setStep("upload");
    setParseResult(null);
    setImportResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  const selectedType = TYPE_OPTIONS.find((o) => o.value === type)!;

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        {(["upload", "preview", "done"] as const).map((s, i) => {
          const labels = ["Subir archivo", "Previsualizar", "Resultado"];
          const active = step === s || (step === "importing" && s === "preview");
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <ChevronRight className="w-4 h-4 text-slate-300" />}
              <span className={`font-medium ${active ? "text-emerald-600" : ""}`}>
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* STEP: Upload */}
      {step === "upload" && (
        <div className="space-y-6">
          {/* Type selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  type === opt.value
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-slate-200 hover:border-emerald-300 bg-white"
                }`}
              >
                <p className={`font-semibold text-sm ${type === opt.value ? "text-emerald-700" : "text-slate-700"}`}>
                  {opt.label}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opt.columns}</p>
              </button>
            ))}
          </div>

          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer ${
              isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-300 hover:border-emerald-400"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileRef.current?.click()}
          >
            <FileSpreadsheet className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold">Arrastra tu archivo .xlsx aquí</p>
            <p className="text-slate-400 text-sm mt-1">o haz clic para seleccionar</p>
            <p className="text-xs text-slate-400 mt-3">
              Máximo 500 filas · 10MB · Solo archivos .xlsx
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* STEP: Importing (spinner) */}
      {step === "importing" && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-slate-600 font-medium">Procesando archivo…</p>
        </div>
      )}

      {/* STEP: Preview */}
      {step === "preview" && parseResult && (
        <div className="space-y-6">
          <PreviewTable preview={parseResult.preview} totalRows={parseResult.totalRows} />
          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">{error}</div>
          )}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Confirmar importación de {parseResult.totalRows} registros
            </button>
          </div>
        </div>
      )}

      {/* STEP: Done */}
      {step === "done" && importResult && (
        <ResultSummary result={importResult} onReset={handleReset} />
      )}
    </div>
  );
}
