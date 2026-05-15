"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { toggleMilestoneAction, deleteMilestoneAction, createMilestoneAction } from "./actions";
import { FormWithToast } from "@/components/ui/FormWithToast";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
}

interface Props {
  milestones: Milestone[];
  projectId: string;
}

export function MilestonesSection({ milestones, projectId }: Props) {
  const t = useTranslations("ProjectDetail");

  const total = milestones.length;
  const completed = milestones.filter(m => m.status === "COMPLETED").length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {total > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="font-medium text-slate-600">{t("progressTitle")}</span>
            <span className="font-semibold text-emerald-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* List */}
      {milestones.length === 0 ? (
        <p className="text-sm text-slate-400 italic">{t("noMilestones")}</p>
      ) : (
        <ul className="space-y-2">
          {milestones.map((m) => (
            <li key={m.id} className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
              {/* Toggle */}
              <FormWithToast action={toggleMilestoneAction} successMessage={t("successToggleMilestone")}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="currentStatus" value={m.status} />
                <input type="hidden" name="projectId" value={projectId} />
                <button type="submit" className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors">
                  {m.status === "COMPLETED"
                    ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    : <Circle className="w-5 h-5" />}
                </button>
              </FormWithToast>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${m.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-800"}`}>
                  {m.title}
                </p>
                {m.description && (
                  <p className="text-xs text-slate-500 mt-0.5">{m.description}</p>
                )}
                {m.dueDate && (
                  <p className="text-xs text-slate-400 mt-1">
                    📅 {new Date(m.dueDate).toLocaleDateString()}
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${m.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                      {m.status === "COMPLETED" ? t("statusCompleted") : t("statusPending")}
                    </span>
                  </p>
                )}
              </div>
              {/* Delete */}
              <FormWithToast action={deleteMilestoneAction} successMessage={t("successDeleteMilestone")}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="projectId" value={projectId} />
                <button
                  type="submit"
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </FormWithToast>
            </li>
          ))}
        </ul>
      )}

      {/* Add form */}
      <FormWithToast
        action={createMilestoneAction}
        successMessage={t("successCreateMilestone")}
        className="border border-dashed border-slate-300 rounded-xl p-4 space-y-3 bg-white"
      >
        <input type="hidden" name="projectId" value={projectId} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            name="title"
            required
            placeholder={t("milestoneTitleLabel")}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            name="dueDate"
            type="date"
            placeholder={t("milestoneDueDateLabel")}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <input
          name="description"
          placeholder={t("milestoneDescLabel")}
          className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {t("milestoneSubmit")}
        </button>
      </FormWithToast>
    </div>
  );
}
