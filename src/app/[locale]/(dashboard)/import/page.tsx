import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ImportWizard } from "./ImportWizard";
import { FileSpreadsheet } from "lucide-react";

const ALLOWED_ROLES = ["SUPER_ADMIN", "DIRECTOR"];

export default async function ImportPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/es/login");

  const role = (session.user as any)?.role;
  if (!ALLOWED_ROLES.includes(role)) redirect("/es");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Importar Datos</h2>
          <p className="text-sm text-slate-500">
            Carga masiva desde archivos Excel (.xlsx) · Máximo 500 registros por importación
          </p>
        </div>
      </div>

      {/* Column reference */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600 space-y-3">
        <p className="font-semibold text-slate-700">📋 Formato de las columnas por plantilla</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium text-slate-700 mb-1">Voluntarios</p>
            <code className="text-xs block leading-relaxed text-slate-500">
              nombre · apellido · email<br />
              telefono · habilidades · fecha_registro
            </code>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Proyectos</p>
            <code className="text-xs block leading-relaxed text-slate-500">
              nombre · descripcion · ubicacion<br />
              presupuesto · estado · fecha_inicio · fecha_fin
            </code>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">Donaciones</p>
            <code className="text-xs block leading-relaxed text-slate-500">
              nombre_donante · email · monto<br />
              fecha · proyecto · notas
            </code>
          </div>
        </div>
        <p className="text-xs text-slate-400">
          La primera fila del archivo debe ser el encabezado con los nombres exactos de las columnas.
          El campo <strong>estado</strong> acepta: PLANNING, ACTIVE o COMPLETED.
        </p>
      </div>

      {/* Wizard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <ImportWizard />
      </div>
    </div>
  );
}
