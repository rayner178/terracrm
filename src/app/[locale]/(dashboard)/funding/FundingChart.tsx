"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Props {
  donationsTotal: number;
  grantsTotal: number;
}

const COLORS = ["#059669", "#0284c7"];

export function FundingChart({ donationsTotal, grantsTotal }: Props) {
  const t = useTranslations("Funding");
  const data = [
    { name: t("typeDonation"), value: donationsTotal },
    { name: t("typeGrant"),    value: grantsTotal },
  ].filter((d) => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => `$${Number(val).toLocaleString("en-US")}`}
            contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
