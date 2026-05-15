import { getTranslations } from "next-intl/server";
import { fetchDonations, fetchGrants, fetchActiveProjects, createDonationAction, createGrantAction } from "./actions";
import { FundingChart } from "./FundingChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormWithToast } from "@/components/ui/FormWithToast";

export default async function FundingPage() {
  const t = await getTranslations("Funding");
  const [donations, grants, projects] = await Promise.all([
    fetchDonations() as Promise<any[]>,
    fetchGrants() as Promise<any[]>,
    fetchActiveProjects(),
  ]);

  const donationsTotal = donations.reduce((s, d) => s + d.amount, 0);
  const grantsTotal    = grants.reduce((s, d) => s + d.amount, 0);
  const total          = donationsTotal + grantsTotal;

  return (
    <div className="space-y-8">

      {/* Header + Totals */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">{t("title")}</h2>
        <div className="flex gap-3 flex-wrap">
          <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-md font-semibold text-sm border border-emerald-100">
            {t("donationsTotal")}: <strong>${donationsTotal.toLocaleString("en-US")}</strong>
          </div>
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-md font-semibold text-sm border border-blue-100">
            {t("grantsTotal")}: <strong>${grantsTotal.toLocaleString("en-US")}</strong>
          </div>
          <div className="bg-slate-800 text-white px-4 py-2 rounded-md font-semibold text-sm">
            {t("totalRaised")}: <strong>${total.toLocaleString("en-US")}</strong>
          </div>
        </div>
      </div>

      {/* Chart */}
      {total > 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <FundingChart donationsTotal={donationsTotal} grantsTotal={grantsTotal} />
          </CardContent>
        </Card>
      )}

      {/* ── SECTION: Donaciones ── */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("typeDonation")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border-0 shadow-sm h-fit">
            <CardHeader><CardTitle className="text-base">{t("registerTitle")}</CardTitle></CardHeader>
            <CardContent>
              <FormWithToast action={createDonationAction} successMessage={t("successDonation")} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("donorLabel")}</label>
                  <Input name="donorName" required className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("amountLabel")}</label>
                  <Input name="amount" type="number" step="0.01" required className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("projectLabel")}</label>
                  <select name="projectId" className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm">
                    <option value="">{t("generalFund")}</option>
                    {projects.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  {t("registerButton")}
                </Button>
              </FormWithToast>
            </CardContent>
          </Card>

          <Card className="col-span-2 border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">{t("historyTitle")}</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{t("colDate")}</TableHead>
                      <TableHead>{t("colDonor")}</TableHead>
                      <TableHead>{t("colProject")}</TableHead>
                      <TableHead className="text-right">{t("colAmount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-6">{t("empty")}</TableCell></TableRow>
                    )}
                    {donations.map((don: any) => (
                      <TableRow key={don.id}>
                        <TableCell className="text-slate-500 text-sm">{new Date(don.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium text-slate-800">{don.donorName}</TableCell>
                        <TableCell className="text-slate-600">
                          {don.project
                            ? <span className="px-2 py-1 bg-slate-100 rounded-md text-xs">{don.project.name}</span>
                            : <span className="text-xs text-slate-400 italic">{t("generalLabel")}</span>}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-emerald-600">${don.amount.toLocaleString("en-US")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── SECTION: Grants ── */}
      <div>
        <h3 className="text-lg font-semibold text-slate-700 mb-4">{t("grantsTitle")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 border-0 shadow-sm h-fit">
            <CardHeader><CardTitle className="text-base">{t("registerTitle")}</CardTitle></CardHeader>
            <CardContent>
              <FormWithToast action={createGrantAction} successMessage={t("successGrant")} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("funderOrgLabel")}</label>
                  <Input name="funderOrg" required className="bg-slate-50" placeholder="USAID, GEF, ONU..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("donorLabel")}</label>
                  <Input name="donorName" required className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("amountLabel")}</label>
                  <Input name="amount" type="number" step="0.01" required className="bg-slate-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("projectLabel")}</label>
                  <select name="projectId" className="w-full h-10 px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-sm">
                    <option value="">{t("generalFund")}</option>
                    {projects.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">{t("notesLabel")}</label>
                  <Input name="notes" className="bg-slate-50" />
                </div>
                <input type="hidden" name="isRestricted" value="true" />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {t("registerGrantButton")}
                </Button>
              </FormWithToast>
            </CardContent>
          </Card>

          <Card className="col-span-2 border-0 shadow-sm">
            <CardHeader><CardTitle className="text-base">{t("grantsTitle")}</CardTitle></CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>{t("colDate")}</TableHead>
                      <TableHead>{t("colFunder")}</TableHead>
                      <TableHead>{t("colProject")}</TableHead>
                      <TableHead className="text-right">{t("colAmount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grants.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center text-slate-500 py-6">{t("empty")}</TableCell></TableRow>
                    )}
                    {grants.map((g: any) => (
                      <TableRow key={g.id}>
                        <TableCell className="text-slate-500 text-sm">{new Date(g.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium text-slate-800">
                          {g.funderOrg && <span className="text-xs text-blue-600 font-semibold mr-1">{g.funderOrg}</span>}
                          {g.donorName}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {g.project
                            ? <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">{g.project.name}</span>
                            : <span className="text-xs text-slate-400 italic">{t("generalLabel")}</span>}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-blue-600">${g.amount.toLocaleString("en-US")}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
