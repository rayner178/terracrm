import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { ImportWizard } from "./ImportWizard";
import { FileSpreadsheet } from "lucide-react";

const ALLOWED_ROLES = ["SUPER_ADMIN", "DIRECTOR"];

export default async function ImportPage() {
  const [session, locale, t] = await Promise.all([
    getServerSession(authOptions),
    getLocale(),
    getTranslations("Import"),
  ]);

  if (!session) redirect(`/${locale}/login`);
  const role = (session.user as any)?.role;
  if (!ALLOWED_ROLES.includes(role)) redirect(`/${locale}`);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t("pageTitle")}</h2>
          <p className="text-sm text-slate-500">{t("pageSubtitle")}</p>
        </div>
      </div>

      {/* Column reference */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-sm text-slate-600 space-y-3">
        <p className="font-semibold text-slate-700">{t("columnsTitle")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-medium text-slate-700 mb-1">{t("typeVolunteers")}</p>
            <code className="text-xs block leading-relaxed text-slate-500">
              nombre · apellido · email<br />
              telefono · habilidades · fecha_registro
            </code>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">{t("typeProjects")}</p>
            <code className="text-xs block leading-relaxed text-slate-500">
              nombre · descripcion · ubicacion<br />
              presupuesto · estado · fecha_inicio · fecha_fin
            </code>
          </div>
          <div>
            <p className="font-medium text-slate-700 mb-1">{t("typeDonations")}</p>
            <code className="text-xs block leading-relaxed text-slate-500">
              nombre_donante · email · monto<br />
              fecha · proyecto · notas
            </code>
          </div>
        </div>
        <p className="text-xs text-slate-400">{t("columnsNote")}</p>
      </div>

      {/* Wizard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <ImportWizard />
      </div>
    </div>
  );
}
