"use client";

import { useTranslations } from "next-intl";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { MetricDefinition, MetricRecord } from "@/modules/impact/domain/ImpactMetric";

interface ImpactChartProps {
  records: MetricRecord[];
  definitions: MetricDefinition[];
}

export function ImpactChart({ records, definitions }: ImpactChartProps) {
  const t = useTranslations("ImpactChart");

  const data = records.reduce((acc: any[], record) => {
    const dateStr = new Date(record.date).toISOString().split("T")[0];
    const def = definitions.find((d) => d.id === record.metricDefinitionId);
    if (!def) return acc;
    let existing = acc.find((d) => d.date === dateStr);
    if (!existing) { existing = { date: dateStr }; acc.push(existing); }
    existing[def.name] = (existing[def.name] || 0) + record.value;
    return acc;
  }, []);

  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (data.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-slate-400">{t("empty")}</div>;
  }

  const colors = ["#059669", "#0284c7", "#e11d48", "#d97706", "#7c3aed", "#c026d3"];

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }} />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          {definitions.map((def, i) => (
            <Line
              key={def.id}
              type="monotone"
              dataKey={def.name}
              name={`${def.name} (${def.unit})`}
              stroke={colors[i % colors.length]}
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
