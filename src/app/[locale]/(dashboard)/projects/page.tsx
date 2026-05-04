import { getTranslations } from "next-intl/server";
import { fetchProjects, createProjectAction, updateProjectStatusAction } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  const projects = await fetchProjects();

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
            <form action={createProjectAction} className="space-y-4">
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
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {t("createButton")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("portfolioTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>{t("colProject")}</TableHead>
                    <TableHead>{t("colLocation")}</TableHead>
                    <TableHead>{t("colStatus")}</TableHead>
                    <TableHead>{t("colActions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                        {t("empty")}
                      </TableCell>
                    </TableRow>
                  )}
                  {projects.map((proj) => (
                    <TableRow key={proj.id}>
                      <TableCell className="font-medium text-slate-800">{proj.name}</TableCell>
                      <TableCell className="text-slate-600">{proj.location || "-"}</TableCell>
                      <TableCell>{getStatusBadge(proj.status)}</TableCell>
                      <TableCell>
                        <form action={updateProjectStatusAction} className="flex gap-2">
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
                        </form>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
