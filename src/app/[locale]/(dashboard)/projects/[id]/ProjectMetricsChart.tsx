"use client";

import { useTranslations } from "next-intl";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

interface MetricRecord {
  id: string;
  value: number;
  date: Date;
  metric: { id: string; name: string; unit: string };
}

interface Props {
  records: MetricRecord[];
}

export function ProjectMetricsChart({ records }: Props) {
  const t = useTranslations("ProjectDetail");

  if (records.length === 0) {
    return <p className="text-sm text-slate-400 italic">{t("noMetrics")}</p>;
  }

  // Group by metric name, summing values
  const grouped: Record<string, number> = {};
  records.forEach((r) => {
    const key = `${r.metric.name} (${r.metric.unit})`;
    grouped[key] = (grouped[key] ?? 0) + r.value;
  });

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "16px" }}>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
          <YAxis tick={{ fill: "#64748b" }} />
          <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
          <Bar dataKey="value" fill="#16a34a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
