// src/pages/Dashboard/Home.jsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../Dashboard/utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "./utils/helper";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI insights state
  const [insights, setInsights] = useState([]);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const [insightsError, setInsightsError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/v1/dashboard");
        if (response.data) {
          setDashboardData(response.data);
        } else {
          setDashboardData(null);
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setDashboardData(null);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Fetch smart insights
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setInsightsLoading(true);
        setInsightsError(null);

        const res = await axiosInstance.get("/api/v1/insights/monthly");
        setInsights(res.data?.insights || []);
      } catch (err) {
        console.error("Insights fetch error:", err);
        setInsightsError("Unable to load smart insights.");
        setInsights([]);
      } finally {
        setInsightsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <DashboardLayout activeMenu="Dashboard">
        <div className="my-8 mx-auto max-w-5xl p-8 rounded-xl shadow-lg bg-gradient-to-bl from-blue-50 via-white to-orange-100 text-center">
          <p className="text-xl font-medium text-gray-600">
            Loading Dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-8 mx-auto max-w-5xl p-8 rounded-xl shadow-lg bg-gradient-to-bl from-blue-50 via-white to-orange-100">
        <h2 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Welcome to your Dashboard
        </h2>

        {error && (
          <div className="mb-4 text-red-500 text-center font-medium">
            {error}
          </div>
        )}

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-gradient-to-br from-blue-400 to-blue-700"
            className="hover:scale-105"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-gradient-to-br from-green-400 to-green-700"
            className="hover:scale-105"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpense || 0)}
            color="bg-gradient-to-br from-red-400 to-orange-500"
            className="hover:scale-105"
          />
        </div>

        {/* SMART INSIGHTS CARD */}
        <div className="mt-8">
          <div className="rounded-2xl bg-white/80 shadow-md p-6 border border-blue-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Smart Insights
            </h3>

            {insightsLoading && (
              <p className="text-gray-500 text-sm">Analyzing your spending…</p>
            )}

            {insightsError && !insightsLoading && (
              <p className="text-red-500 text-sm">{insightsError}</p>
            )}

            {!insightsLoading && !insightsError && insights.length === 0 && (
              <p className="text-gray-500 text-sm">
                Not enough data yet. Add some income and expenses to see
                insights.
              </p>
            )}

            {!insightsLoading && insights.length > 0 && (
              <ul className="space-y-1 text-sm">
                {insights.map((line, idx) => {
                  const lower = line.toLowerCase();
                  const isWarning =
                    lower.includes("overspent") ||
                    lower.includes("more on") ||
                    lower.includes("limit of");

                  const colorClass = isWarning
                    ? "text-red-600"
                    : "text-green-700";

                  return (
                    <li
                      key={idx}
                      className={`${colorClass} list-disc ml-5`}
                    >
                      {line}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* EXISTING DASHBOARD SECTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpense || 0}
          />

          <ExpenseTransactions
            transactions={
              dashboardData?.last30DaysExpenses?.transactions || []
            }
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart
            data={
              dashboardData?.last60DaysIncome?.transactions?.slice(0, 10) || []
            }
            totalIncome={dashboardData?.totalIncome || 0}
          />

          <RecentIncome
            transactions={
              dashboardData?.last60DaysIncome?.transactions?.slice(0, 5) || []
            }
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
