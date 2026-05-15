import { getTranslations, getLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchProjectById, assignVolunteerAction, recordProjectMetricAction } from "./actions";
import { ProjectFinanceBar } from "./ProjectFinanceBar";
import { ProjectMetricsChart } from "./ProjectMetricsChart";
import { MilestonesSection } from "./MilestonesSection";
import { FormWithToast } from "@/components/ui/FormWithToast";
import { container } from "@/core/di/registry";
import { ArrowLeft, MapPin, Calendar, Leaf } from "lucide-react";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <h3 className="text-base font-semibold text-slate-700 border-b border-slate-100 pb-3">{title}</h3>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    ACTIVE:    { label: "Activo",      cls: "bg-blue-100 text-blue-800" },
    COMPLETED: { label: "Completado",  cls: "bg-emerald-100 text-emerald-800" },
    PLANNING:  { label: "Planificación", cls: "bg-slate-100 text-slate-700" },
  };
  const { label, cls } = map[status] ?? map.PLANNING;
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string; locale: string }> }) {
  const { id } = await params;
  const [t, locale, project, volunteersRes, metrics] = await Promise.all([
    getTranslations("ProjectDetail"),
    getLocale(),
    fetchProjectById(id),
    container.getVolunteersUseCase.execute(1, 100),
    container.impactRepository.getDefinitions(),
  ]);

  const volunteers = volunteersRes?.data || [];

  if (!project) notFound();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href={`/${locale}/projects`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToProjects")}
        </Link>
        <div className="flex flex-wrap items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-3xl font-bold text-slate-800 truncate">{project.name}</h1>
              <StatusBadge status={project.status} />
              {project.ecosystemType && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
                  <Leaf className="w-3 h-3" /> {project.ecosystemType}
                </span>
              )}
            </div>
            {project.description && (
              <p className="text-slate-500 text-sm">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {project.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : t("notDefined")}
                {" → "}
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : t("notDefined")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Finance */}
      <SectionCard title={t("budgetSection")}>
        <ProjectFinanceBar budget={project.budget} spent={project.spent} />
      </SectionCard>

      {/* Metrics */}
      <SectionCard title={t("metricsSection")}>
        <div className="flex flex-col gap-4">
          <FormWithToast action={recordProjectMetricAction} successMessage={t("successMetric")} className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 flex-wrap">
            <input type="hidden" name="projectId" value={project.id} />
            <select name="metricDefinitionId" required className="flex-1 min-w-[150px] h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">{t("selectMetric")}</option>
              {metrics.map(m => <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>)}
            </select>
            <input type="number" name="value" placeholder={t("metricValuePlaceholder")} step="0.01" required className="w-24 h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <button type="submit" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
              {t("registerButton")}
            </button>
          </FormWithToast>
          <ProjectMetricsChart records={project.metricRecords as any} />
        </div>
      </SectionCard>

      {/* Allies */}
      <SectionCard title={t("alliesSection")}>
        <div className="flex flex-col gap-4">
          <FormWithToast action={assignVolunteerAction} successMessage={t("successAssign")} className="flex gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 flex-wrap">
            <input type="hidden" name="projectId" value={project.id} />
            <select name="volunteerId" required className="flex-1 min-w-[150px] h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400">
              <option value="">{t("selectAlly")}</option>
              {volunteers.map(v => <option key={v.id} value={v.id}>{v.firstName} {v.lastName}</option>)}
            </select>
            <input type="number" name="hoursWorked" placeholder={t("hoursPlaceholder")} min="0" className="w-24 h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400" />
            <button type="submit" className="h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
              {t("assignButton")}
            </button>
          </FormWithToast>
          
          {project.assignments.length === 0 ? (
            <p className="text-sm text-slate-400 italic">{t("noAllies")}</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase border-b border-slate-100">
                <tr>
                  <th className="text-left py-2">{t("colAlly")}</th>
                  <th className="text-right py-2">{t("colHours")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {project.assignments.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2 font-medium text-slate-700">
                      {a.volunteer.firstName} {a.volunteer.lastName}
                      <span className="ml-2 text-xs text-slate-400">{a.volunteer.email}</span>
                    </td>
                    <td className="py-2 text-right text-slate-600">{a.hoursWorked}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </SectionCard>

      {/* Donations */}
      <SectionCard title={t("donationsSection")}>
        {project.donations.length === 0 ? (
          <p className="text-sm text-slate-400 italic">{t("noDonations")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-500 uppercase border-b border-slate-100">
              <tr>
                <th className="text-left py-2">{t("colDonor")}</th>
                <th className="text-left py-2">{t("colDate")}</th>
                <th className="text-right py-2">{t("colAmount")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {project.donations.map((d) => (
                <tr key={d.id}>
                  <td className="py-2 font-medium text-slate-700">{d.donorName}</td>
                  <td className="py-2 text-slate-500 text-xs">{new Date(d.date).toLocaleDateString()}</td>
                  <td className="py-2 text-right font-semibold text-emerald-600">${Number(d.amount).toLocaleString("en-US")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>

      {/* Milestones */}
      <SectionCard title={t("milestonesSection")}>
        <MilestonesSection milestones={project.milestones as any} projectId={project.id} />
      </SectionCard>
    </div>
  );
}
