export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};
export const addThousandsSeparator = (num) => {
  if (num === null || isNaN(num)) return;

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};
export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map(item => ({
    category: item.category,
    amount: item.amount,
  }));
  return chartData;
};
import moment from "moment";

export const prepareIncomeBarChartData = (data = []) => {
  const chartData = data.map(item => ({
    month: item.date && moment(item.date).isValid()
      ? moment(item.date).format("Do MMM")
      : "Unknown",
    amount: typeof item.amount === "string"
      ? Number(item.amount)
      : item.amount,
  }));
  return chartData;
};
// src/utils/chartHelpers.js


export function prepareExpenseLineChartData(transactions = []) {
  const groups = {};
  transactions.forEach(tx => {
    const dateKey = new Date(tx.date).toLocaleDateString("en-US", { day: "numeric", month: "short" });
    groups[dateKey] = (groups[dateKey] || 0) + tx.amount;
  });
  // Recharts expects [ { date, amount }, ... ]
  return Object.entries(groups).map(([date, amount]) => ({
    date,
    amount,
  }));
}
