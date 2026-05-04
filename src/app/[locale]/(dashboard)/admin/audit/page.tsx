import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { container } from "@/core/di/registry";

export default async function AuditPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const session = await getServerSession(authOptions);
  if (!session || !["SUPER_ADMIN", "AUDITOR"].includes((session.user as any)?.role)) redirect("/");

  const t = await getTranslations("Audit");

  const filters = {
    userId:    searchParams.userId,
    entity:    searchParams.entity,
    startDate: searchParams.startDate,
    endDate:   searchParams.endDate,
  };

  const logs = await container.getAuditLogsUseCase.execute(filters);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">{t("title")}</h1>
        <p className="text-slate-500 mt-1">{t("subtitle")}</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <form className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t("filterEntity")}</label>
            <input type="text" name="entity" defaultValue={filters.entity} className="border border-slate-300 rounded px-3 py-2 text-sm" placeholder={t("filterEntityPlaceholder")} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t("filterUser")}</label>
            <input type="text" name="userId" defaultValue={filters.userId} className="border border-slate-300 rounded px-3 py-2 text-sm" placeholder="UUID" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t("filterFrom")}</label>
            <input type="date" name="startDate" defaultValue={filters.startDate} className="border border-slate-300 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t("filterTo")}</label>
            <input type="date" name="endDate" defaultValue={filters.endDate} className="border border-slate-300 rounded px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700 transition">
            {t("filterButton")}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-medium">{t("colDate")}</th>
                <th className="px-6 py-3 font-medium">{t("colUser")}</th>
                <th className="px-6 py-3 font-medium">{t("colAction")}</th>
                <th className="px-6 py-3 font-medium">{t("colEntity")}</th>
                <th className="px-6 py-3 font-medium">{t("colDetails")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono text-xs">{log.userId || t("system")}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{log.entity}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500 truncate max-w-xs" title={JSON.stringify(log.changes)}>
                    {JSON.stringify(log.changes)}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">{t("empty")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
