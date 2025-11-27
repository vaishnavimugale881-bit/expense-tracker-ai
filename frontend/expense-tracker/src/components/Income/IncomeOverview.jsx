import React, { useMemo } from "react";
import { LuPlus } from "react-icons/lu";
import CustomBarChart from "../../components/Charts/CustomBarChart";
import { prepareIncomeBarChartData } from "../../pages/Dashboard/utils/helper";

const IncomeOverview = ({ transactions, onAddIncome }) => {
  // Use useMemo for derived data, not useState/useEffect (prevents infinite re-render)
  const chartData = useMemo(() => prepareIncomeBarChartData(transactions), [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-lg">Income Overview</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Add Income
        </button>
      </div>
      <div className="mt-10">
        {Array.isArray(chartData) && chartData.length > 0 ? (
          <CustomBarChart
            data={chartData}
            xKey="month"
            yKey="amount"
            color="#4ade80"
            height={320}
          />
        ) : (
          <p>No income data available.</p>
        )}
      </div>
    </div>
  );
};

export default IncomeOverview;
