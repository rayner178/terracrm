import { getTranslations } from "next-intl/server";
import { FileText, FileSpreadsheet, Download } from "lucide-react";

export default async function ReportsPage() {
  const t = await getTranslations("Navigation");

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Reportes Institucionales</h1>
        <p className="text-slate-500 mt-1">Exportación de datos consolidados para ONGs Internacionales y Auditorías</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PDF Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Reporte Ejecutivo (PDF)</h2>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Resumen visual de impacto ecológico y resumen financiero. Ideal para presentaciones y compartición con donantes.
          </p>
          <a 
            href="/api/reports/pdf" 
            className="w-full inline-flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar PDF
          </a>
        </div>

        {/* Excel Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-2">Datos Crudos (Excel)</h2>
          <p className="text-sm text-slate-500 mb-6 flex-1">
            Exportación tabular completa de finanzas, listado de proyectos y métricas. Ideal para auditorías y análisis de datos.
          </p>
          <a 
            href="/api/reports/excel" 
            className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Descargar Excel (.xlsx)
          </a>
        </div>

      </div>
    </div>
  );
}
