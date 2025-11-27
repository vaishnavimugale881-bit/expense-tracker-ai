import React from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
} from "recharts";

// Utility for pretty Y-axis numbers (addThousandsSeparator)
const addThousandsSeparator = (num) =>
  typeof num === "number" ? num.toLocaleString() : num;

const CustomBarChart = ({
  data = [],
  xKey = "month",
  yKey = "amount",
  color = "#4ade80",
  height = 300,
  ...props
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} margin={{ top: 16, right: 30, left: 0, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis tickFormatter={addThousandsSeparator} />
      <Tooltip formatter={addThousandsSeparator} labelFormatter={(v) => `${xKey}: ${v}`} />
      <Bar dataKey={yKey} fill={color} />
    </BarChart>
  </ResponsiveContainer>
);

export default CustomBarChart;
