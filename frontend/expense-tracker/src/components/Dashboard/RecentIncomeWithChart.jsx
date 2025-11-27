import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE', '#FF6666', '#4FC3F7',
];

const prepareChartData = (data = []) =>
  data.map(item => ({
    name: item.category || item.source || 'Income',
    value: item.amount,
  }));

const RecentIncomePieChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(prepareChartData(data));
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
        <span className="font-semibold">Total: {totalIncome}</span>
      </div>
      {Array.isArray(data) && data.length === 0 ? (
        <div className="text-gray-500 text-center mt-4">
          No income transactions found.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RecentIncomePieChart;
