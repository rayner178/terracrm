"use client";

import { useTranslations } from "next-intl";

interface Props {
  budget: number | null;
  spent: number | null;
}

export function ProjectFinanceBar({ budget, spent }: Props) {
  const t = useTranslations("ProjectDetail");

  if (!budget) {
    return (
      <p className="text-sm text-slate-400 italic">{t("noBudget")}</p>
    );
  }

  const spentVal = spent ?? 0;
  const balance = budget - spentVal;
  const pct = Math.min(Math.round((spentVal / budget) * 100), 100);

  const barColor =
    pct >= 90 ? "bg-rose-500" : pct >= 70 ? "bg-amber-400" : "bg-emerald-500";
  const textColor =
    pct >= 90 ? "text-rose-600" : pct >= 70 ? "text-amber-600" : "text-emerald-600";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-1">{t("budgetLabel")}</p>
          <p className="text-xl font-bold text-slate-800">${budget.toLocaleString("en-US")}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-1">{t("spentLabel")}</p>
          <p className={`text-xl font-bold ${textColor}`}>${spentVal.toLocaleString("en-US")}</p>
        </div>
        <div className={`rounded-xl p-4 border text-center ${balance < 0 ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"}`}>
          <p className="text-xs text-slate-500 mb-1">{t("balanceLabel")}</p>
          <p className={`text-xl font-bold ${balance < 0 ? "text-rose-600" : "text-emerald-600"}`}>
            ${balance.toLocaleString("en-US")}
          </p>
        </div>
      </div>
      <div>
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>{t("progressLabel")}</span>
          <span className={`font-semibold ${textColor}`}>{pct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
