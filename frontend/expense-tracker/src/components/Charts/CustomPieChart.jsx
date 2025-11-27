import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

// Custom Legend renderer
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <ul className="flex justify-center items-center space-x-6 mt-2">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="font-semibold text-gray-600">{entry.value}</span>
        </li>
      ))}
    </ul>
  );
};

const CustomPieChart = ({
  data = [],
  label = "",
  totalAmount = "",
  colors = [],
  showTextAnchor = false,
}) => {
  // Calculate total and percentages
  const total = data.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="w-full flex flex-col items-center bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* IMPORTANT: relative parent for absolute badge */}
      <div className="w-full flex flex-col items-center relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={85}
              labelLine={false}
              paddingAngle={1}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center badge for total balance */}
        {showTextAnchor && total > 0 && (
          <div
            className="absolute left-1/2 top-[120px] -translate-x-1/2 flex flex-col items-center w-36 h-36 justify-center rounded-full shadow border-4 border-gray-50 bg-gradient-to-br from-blue-50 via-white to-orange-100"
            style={{ pointerEvents: "none" }}
          >
            <span className="text-lg font-bold text-gray-700">{label}</span>
            <span className="text-2xl font-extrabold text-blue-600 mt-2">
              ₹{totalAmount}
            </span>
          </div>
        )}
      </div>
      {/* Slice details below chart */}
      <div className="flex flex-col space-y-2 w-full mt-6">
        {data.map((entry, idx) => {
          const percent = total > 0 ? ((entry.amount / total) * 100).toFixed(1) : 0;
          return (
            <div key={`${entry.name}-${idx}`} className="flex items-center gap-3">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ background: colors[idx % colors.length] }}
              />
              <span className={`font-semibold text-gray-700`}>
                {entry.name}
              </span>
              <span className="ml-auto font-bold text-gray-700">
                ₹{entry.amount} <span className="text-sm text-gray-400 pl-1">({percent}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomPieChart;
