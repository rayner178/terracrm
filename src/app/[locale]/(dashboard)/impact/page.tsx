import { container } from "@/core/di/registry";
import { getTranslations } from "next-intl/server";
import { ImpactChart } from "./ImpactChart";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function ImpactPage() {
  const t = await getTranslations("Impact");
  const session = await getServerSession(authOptions);
  
  // Obtenemos datos puros del caso de uso
  const data = await container.getImpactDashboardUseCase.execute();
  const { definitions, records } = data;
  
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t('title')}</h1>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <ImpactChart records={records} definitions={definitions} />
      </div>
      
      {session && !["TESORERO", "AUDITOR"].includes((session.user as any)?.role) && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4">{t('recordValue')}</h2>
          {/* TODO: Agregar Formulario Client-Side para recordMetricAction() */}
          <p className="text-sm text-slate-500">Módulo de registro habilitado para tu rol.</p>
        </div>
      )}
    </div>
  );
}
