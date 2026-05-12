"use client";

import { useTranslations } from "next-intl";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
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
  const colors = ["#059669", "#0284c7", "#e11d48", "#d97706", "#7c3aed"];

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            angle={-20}
            textAnchor="end"
          />
          <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <rect key={i} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
