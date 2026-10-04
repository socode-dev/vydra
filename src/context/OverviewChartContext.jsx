import { createContext, useContext, useMemo } from "react";
import useTransactionStore from "../store/useTransactionStore";
import { eachMonthOfInterval, format } from "date-fns";
import { useOverviewContext } from "./OverviewContext";
import { formatAmount, compactAmount } from "../utils/formatAmount";
import useCurrencyStore from "../store/useCurrencyStore";
import useThemeStore from "../store/useThemeStore";

const OverviewChartContext = createContext();

export const OverviewChartProvider = ({ children }) => {
  const transactions = useTransactionStore((state) => state.transactions);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const { totalBudget, totalBudgetUsed } = useOverviewContext();
  const theme = useThemeStore((state) => state.theme);

  const isDarkMode = theme === "dark";

  const incomeColor = "#10B981";
  const incomeBGColor = isDarkMode
    ? "rgba(16, 185, 129, 0.18)"
    : "rgba(16, 185, 129, 0.12)";

  const expenseColor = "#F43F5E";
  const expenseBGColor = isDarkMode
    ? "rgba(244, 63, 94, 0.16)"
    : "rgba(244, 63, 94, 0.1)";

  const textColor = isDarkMode ? "rgb(160, 168, 181)" : "rgb(100, 116, 139)";
  const gridColor = isDarkMode
    ? "rgba(148, 163, 184, 0.16)"
    : "rgba(148, 163, 184, 0.2)";

  const budgetRemaining =
    totalBudget - totalBudgetUsed > 0 ? totalBudget - totalBudgetUsed : 0;

  const monthlySeries = useMemo(() => {
    const totals = new Map();
    for (const transaction of transactions ?? []) {
      const date = new Date(transaction.date);
      const amount = Number(transaction.amount);
      if (
        Number.isNaN(date.getTime()) ||
        !Number.isFinite(amount) ||
        !["income", "expense"].includes(transaction.type)
      )
        continue;
      const key = format(date, "yyyy-MM");
      const month = totals.get(key) || { income: 0, expense: 0, date };
      month[transaction.type] += amount;
      totals.set(key, month);
    }
    const keys = [...totals.keys()].sort();
    if (!keys.length) return [];
    return eachMonthOfInterval({
      start: totals.get(keys[0]).date,
      end: totals.get(keys.at(-1)).date,
    }).map((date) => {
      const total = totals.get(format(date, "yyyy-MM"));
      return {
        label: format(date, "MMM yyyy"),
        income: total?.income ?? 0,
        expense: total?.expense ?? 0,
      };
    });
  }, [transactions]);

  const months = monthlySeries.map((month) => month.label);
  const monthlyIncome = monthlySeries.map((month) => month.income);
  const monthlyExpenses = monthlySeries.map((month) => month.expense);
  const maxValue = monthlySeries.reduce(
    (max, month) => Math.max(max, month.income, month.expense),
    0,
  );

  const areaFill =
    (color, fallback) =>
    ({ chart }) => {
      if (!chart.chartArea) return fallback;
      const gradient = chart.ctx.createLinearGradient(
        0,
        chart.chartArea.top,
        0,
        chart.chartArea.bottom,
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      return gradient;
    };

  const incomeVsExpensesData = {
    labels: months,
    datasets: [
      {
        label: "Income",
        data: monthlyIncome,
        borderColor: incomeColor,
        backgroundColor: areaFill(incomeBGColor, incomeBGColor),
        fill: true,
        cubicInterpolationMode: "monotone",
        pointRadius: months.length === 1 ? 4 : 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 3,
        pointHoverBorderColor: isDarkMode ? "#141922" : "#FFFFFF",
        pointHoverBackgroundColor: incomeColor,
        borderWidth: 2.5,
        borderCapStyle: "round",
        borderJoinStyle: "round",
      },
      {
        label: "Expenses",
        data: monthlyExpenses,
        borderColor: expenseColor,
        backgroundColor: areaFill(expenseBGColor, expenseBGColor),
        fill: true,
        cubicInterpolationMode: "monotone",
        pointRadius: months.length === 1 ? 4 : 0,
        pointHoverRadius: 5,
        pointHoverBorderWidth: 3,
        pointHoverBorderColor: isDarkMode ? "#141922" : "#FFFFFF",
        pointHoverBackgroundColor: expenseColor,
        borderWidth: 2.5,
        borderCapStyle: "round",
        borderJoinStyle: "round",
      },
    ],
  };

  const incomeVsExpensesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    layout: {
      padding: { top: 14, right: 6, bottom: 4, left: 2 },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDarkMode
          ? "rgba(27, 33, 44, 0.98)"
          : "rgba(255, 255, 255, 0.98)",
        titleColor: isDarkMode ? "#F1F3F7" : "#0F172A",
        bodyColor: isDarkMode ? "#A0A8B5" : "#475569",
        borderColor: isDarkMode
          ? "rgba(148, 163, 184, 0.22)"
          : "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 12,
        caretPadding: 10,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 5,
        usePointStyle: true,
        titleFont: {
          family: "DM Sans",
          size: 12,
          weight: "600",
        },
        bodyFont: {
          family: "DM Sans",
          size: 12,
          weight: "500",
        },
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw ?? 0;
            return `${label}: ${formatAmount(value, selectedCurrency)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxValue,
        border: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 5,
          callback: (amount) => compactAmount(amount, selectedCurrency),
          color: textColor,
          font: {
            size: 11,
            family: "DM Sans",
            lineHeight: 1.5,
          },
          padding: 12,
        },
        grid: {
          color: gridColor,
          drawTicks: false,
          lineWidth: 1,
        },
      },
      x: {
        border: {
          display: false,
        },
        ticks: {
          color: textColor,
          maxTicksLimit: 6,
          maxRotation: 0,
          padding: 10,
          font: { size: 11, family: "DM Sans", weight: "500" },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Budget overview doughnut chart data
  const budgetOverviewData = {
    labels: ["Used", "Remaining"],
    datasets: [
      {
        data: [totalBudgetUsed, budgetRemaining],
        backgroundColor: ["#f59e0b", "#9ca3af"],
        hoverBackgroundColor: ["#d97706", "#6b7280"],
        borderWidth: 1,
      },
    ],
  };

  // Budget overview doughnut chart options
  const budgetOverviewOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          color: "#9ca3af",
          font: {
            size: 14,
            weight: "400",
          },
          padding: 12,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const amount = context.raw || "";
            return `${label} ${formatAmount(amount, selectedCurrency)}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <OverviewChartContext.Provider
      value={{
        hasTransactions: monthlySeries.length > 0,
        monthlyIncome,
        monthlyExpenses,
        incomeVsExpensesData,
        incomeVsExpensesOptions,
        budgetOverviewData,
        budgetOverviewOptions,
        gridColor,
      }}
    >
      {children}
    </OverviewChartContext.Provider>
  );
};

export const useOverviewChartContext = () => useContext(OverviewChartContext);
