import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { fetchProjects, createProjectAction, updateProjectStatusAction } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderKanban } from "lucide-react";
import { FormWithToast } from "@/components/ui/FormWithToast";

function BudgetHealth({ budget, spent }: { budget: number | null; spent: number | null }) {
  if (!budget || budget === 0) {
    return <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" title="Sin presupuesto" />;
  }
  const ratio = (spent ?? 0) / budget;
  const color = ratio >= 0.9 ? "bg-rose-500" : ratio >= 0.7 ? "bg-amber-400" : "bg-emerald-500";
  const pct = Math.round(ratio * 100);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-slate-500">{pct}%</span>
    </span>
  );
}

export default async function ProjectsPage() {
  const [t, locale, projects] = await Promise.all([
    getTranslations("Projects"),
    getLocale(),
    fetchProjects(),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":    return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{t("statusActive")}</span>;
      case "COMPLETED": return <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">{t("statusCompleted")}</span>;
      default:          return <span className="px-2 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium">{t("statusPlanning")}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("createTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormWithToast action={createProjectAction} successMessage={t("successCreate")} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("nameLabel")}</label>
                <Input name="name" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("descriptionLabel")}</label>
                <Input name="description" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("locationLabel")}</label>
                <Input name="location" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("statusLabel")}</label>
                <select name="status" className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm">
                  <option value="PLANNING">{t("statusPlanning")}</option>
                  <option value="ACTIVE">{t("statusActive")}</option>
                  <option value="COMPLETED">{t("statusCompleted")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("budgetLabel")}</label>
                <Input name="budget" type="number" step="0.01" min="0" placeholder={t("optionalPlaceholder")} className="bg-slate-50" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("startDateLabel")}</label>
                  <Input name="startDate" type="date" className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("endDateLabel")}</label>
                  <Input name="endDate" type="date" className="bg-slate-50" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {t("createButton")}
              </Button>
            </FormWithToast>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("portfolioTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <FolderKanban className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-slate-500 font-medium mb-1">{t("emptyTitle")}</p>
                <p className="text-sm text-slate-400">{t("emptySubtitle")}</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{t("colProject")}</TableHead>
                      <TableHead>{t("colLocation")}</TableHead>
                      <TableHead>{t("colStatus")}</TableHead>
                      <TableHead>{t("colHealth")}</TableHead>
                      <TableHead>{t("colActions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((proj) => (
                      <TableRow key={proj.id}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/${locale}/projects/${proj.id}`}
                            className="text-slate-800 hover:text-emerald-600 transition-colors hover:underline"
                          >
                            {proj.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-slate-600">{proj.location || "—"}</TableCell>
                        <TableCell>{getStatusBadge(proj.status)}</TableCell>
                        <TableCell>
                          <BudgetHealth budget={proj.budget} spent={proj.spent} />
                        </TableCell>
                        <TableCell>
                          <FormWithToast action={updateProjectStatusAction} successMessage={t("successStatus")} className="flex gap-2">
                            <input type="hidden" name="id" value={proj.id} />
                            {proj.status === "PLANNING" && (
                              <Button type="submit" name="status" value="ACTIVE" size="sm" variant="outline" className="h-8">
                                {t("actionStart")}
                              </Button>
                            )}
                            {proj.status === "ACTIVE" && (
                              <Button type="submit" name="status" value="COMPLETED" size="sm" variant="outline" className="h-8">
                                {t("actionFinish")}
                              </Button>
                            )}
                          </FormWithToast>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
