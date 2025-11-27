import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { LuPlus } from "react-icons/lu";
import { prepareExpenseLineChartData } from "../../pages/Dashboard/utils/helper";
console.log("ExpenseOverview LOADED!");

// (adjust this helper path to your project)

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    setChartData(prepareExpenseLineChartData(transactions));
  }, [transactions]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h2 className="text-xl font-semibold">Expense Overview</h2>
          <div className="text-gray-500 text-sm">
            Track your spending trends over time and gain insights into where your money goes.
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded"
          onClick={onExpenseIncome}
        >
          <LuPlus />
          Add Expense
        </button>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={v => `₹${v}`} />
          <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseOverview;
