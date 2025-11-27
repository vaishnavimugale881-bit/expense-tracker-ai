import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Add the import below—fix the path based on your project
import { prepareExpenseBarChartData } from '../../pages/Dashboard/utils/helper'; // example path

const Last30DaysExpenses = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data) {
      const result = prepareExpenseBarChartData(data);
      setChartData(result);
    }
  }, [data]);

  return (
    <div className="card col-span-1">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 30 Days Expenses</h5>
      </div>
      {Array.isArray(data) && data.length === 0 && (
        <div className="text-gray-500 text-center mt-4">
          No expense transactions found.
        </div>
      )}
      {Array.isArray(data) && data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Last30DaysExpenses;
