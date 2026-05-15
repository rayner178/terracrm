import { getTranslations } from "next-intl/server";
import { fetchVolunteers, createVolunteerAction } from "./actions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import { FormWithToast } from "@/components/ui/FormWithToast";

export default async function VolunteersPage() {
  const t = await getTranslations("Volunteers");
  const result = await fetchVolunteers();
  const volunteers = result.data;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("addTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FormWithToast action={createVolunteerAction} successMessage={t("successCreate")} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("firstNameLabel")}</label>
                <Input name="firstName" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("lastNameLabel")}</label>
                <Input name="lastName" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("emailLabel")}</label>
                <Input name="email" type="email" required className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("phoneLabel")}</label>
                <Input name="phone" className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">{t("skillsLabel")}</label>
                <Input name="skills" placeholder={t("skillsPlaceholder")} className="bg-slate-50" />
              </div>
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {t("saveButton")}
              </Button>
            </FormWithToast>
          </CardContent>
        </Card>

        <Card className="col-span-2 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("directoryTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            {volunteers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-slate-500 font-medium mb-1">{t("emptyTitle")}</p>
                <p className="text-sm text-slate-400">{t("emptySubtitle")}</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{t("colName")}</TableHead>
                      <TableHead>{t("colEmail")}</TableHead>
                      <TableHead>{t("colSkills")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {volunteers.map((vol) => (
                      <TableRow key={vol.id}>
                        <TableCell className="font-medium text-slate-800">{vol.firstName} {vol.lastName}</TableCell>
                        <TableCell className="text-slate-600">{vol.email}</TableCell>
                        <TableCell className="text-slate-600">
                          {vol.skills ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                              {vol.skills}
                            </span>
                          ) : "-"}
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
