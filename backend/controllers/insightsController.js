// backend/controllers/insightsController.js
const Expense = require("../models/Expense");
const Income = require("../models/Income");

const getMonthRange = (year, monthIndex) => {
  const start = new Date(year, monthIndex, 1);
  const end = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);
  return { start, end };
};

const getMonthlyInsights = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const { start: curStart, end: curEnd } = getMonthRange(
      currentYear,
      currentMonth
    );
    const { start: prevStart, end: prevEnd } = getMonthRange(
      prevYear,
      prevMonth
    );

    const currentExpenses = await Expense.aggregate([
      { $match: { userId, date: { $gte: curStart, $lte: curEnd } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const prevExpenses = await Expense.aggregate([
      { $match: { userId, date: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);

    const [currentIncomeAgg, currentExpenseAgg] = await Promise.all([
      Income.aggregate([
        { $match: { userId, date: { $gte: curStart, $lte: curEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
      Expense.aggregate([
        { $match: { userId, date: { $gte: curStart, $lte: curEnd } } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalIncomeCur = currentIncomeAgg[0]?.total || 0;
    const totalExpenseCur = currentExpenseAgg[0]?.total || 0;
    const savingsCur = totalIncomeCur - totalExpenseCur;

    const prevMap = {};
    prevExpenses.forEach((p) => {
      prevMap[p._id] = p.total;
    });

    const insights = [];

    currentExpenses.forEach((ce) => {
      const category = ce._id;
      const curTotal = ce.total;
      const prevTotal = prevMap[category] || 0;
      const diff = curTotal - prevTotal;
      const percent =
        prevTotal === 0 ? (curTotal > 0 ? 100 : 0) : Math.round((diff / prevTotal) * 100);

      const recommendedNext = Math.round(curTotal * 0.8);

      if (prevTotal > 0) {
        if (diff > 0) {
          insights.push(
            `This month you spent ${percent}% more on ${category} than last month. Try keeping it around ₹${recommendedNext} next month.`
          );
        } else if (diff < 0) {
          insights.push(
            `Good job! You reduced your ${category} spending by ${Math.abs(
              percent
            )}% compared to last month.`
          );
        }
      } else if (curTotal > 0) {
        insights.push(
          `You started spending on ${category} this month with a total of ₹${curTotal}. Consider a limit of about ₹${recommendedNext} next month.`
        );
      }
    });

    if (savingsCur > 0) {
      insights.push(
        `You saved ₹${savingsCur} this month. Keeping expenses under ₹${totalIncomeCur} will help you continue this trend.`
      );
    } else if (savingsCur < 0) {
      insights.push(
        `You overspent by ₹${Math.abs(
          savingsCur
        )} this month. Try cutting back your highest categories slightly next month.`
      );
    }

    if (insights.length === 0) {
      insights.push(
        "Not enough data for this month. Add more income and expenses to see smart insights."
      );
    }

    // Limit to top 3 insights so UI stays clean
    const limitedInsights = insights.slice(0, 3);

    res.json({ insights: limitedInsights });
  } catch (error) {
    console.error("Error in getMonthlyInsights:", error);
    res.status(500).json({ message: "Failed to generate insights" });
  }
};

module.exports = { getMonthlyInsights };
