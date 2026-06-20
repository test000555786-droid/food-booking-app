"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DailyReport } from "@/types";

interface DailySalesChartProps {
  data: DailyReport[];
}

export function DailySalesChart({ data }: DailySalesChartProps) {
  if (data.length === 0) {
    return <div className="text-center py-8 text-text-muted text-sm">No data available</div>;
  }

  const formatValue = (value: number) => {
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E6DF" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6B6B68" }}
          axisLine={{ stroke: "#E8E6DF" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6B6B68" }}
          axisLine={{ stroke: "#E8E6DF" }}
          tickLine={false}
          tickFormatter={formatValue}
        />
        <Tooltip
          formatter={(value: number) => formatValue(value)}
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #E8E6DF",
            borderRadius: "12px",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="totalRevenue" fill="#E07B2A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
