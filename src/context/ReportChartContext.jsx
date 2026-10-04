import { useContext, createContext, useMemo } from "react";
import { useReportContext } from "./ReportContext";
import { formatAmount, compactAmount } from "../utils/formatAmount";
import useCurrencyStore from "../store/useCurrencyStore";
import useThemeStore from "../store/useThemeStore";

const ReportChartContext = createContext();
const palette = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#f43f5e",
  "#8b5cf6",
  "#06b6d4",
  "#64748b",
];

export const ReportChartProvider = ({ children }) => {
  const { categoryBreakdown } = useReportContext();
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const theme = useThemeStore((state) => state.theme);
  const dark = theme === "dark";
  const textColor = dark ? "#9ca3af" : "#374151";
  const gridColor = dark ? "#333333" : "#e5e7eb";
  const categories = useMemo(
    () =>
      categoryBreakdown.map((row, index) => ({
        ...row,
        color: palette[index % palette.length],
      })),
    [categoryBreakdown],
  );
  const labels = categories.map((row) => row.category);
  const amounts = categories.map((row) => row.amount);
  const colors = categories.map((row) => row.color);
  const tooltip = {
    backgroundColor: dark ? "#262626" : "#ffffff",
    titleColor: dark ? "#ffffff" : "#0f172a",
    bodyColor: textColor,
    borderColor: gridColor,
    borderWidth: 1,
    cornerRadius: 6,
    padding: 12,
    titleFont: { family: "DM Sans" },
    bodyFont: { family: "DM Sans" },
    callbacks: {
      label: (context) => formatAmount(Number(context.raw), selectedCurrency),
    },
  };
  const doughnutChartData = {
    labels,
    datasets: [
      {
        label: "Expenses by category",
        data: amounts,
        backgroundColor: colors,
        borderColor: dark ? "#191919" : "#ffffff",
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  };
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: { legend: { display: false }, tooltip },
  };
  const barChartData = {
    labels,
    datasets: [
      {
        label: "Expenses by category",
        data: amounts,
        backgroundColor: colors,
        borderRadius: 6,
        borderSkipped: "bottom",
        maxBarThickness: 48,
      },
    ],
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: textColor,
          font: { family: "DM Sans", size: 11 },
          maxRotation: 0,
          autoSkip: true,
          callback: function (value) {
            const label = this.getLabelForValue(value);
            return label.length > 13 ? `${label.slice(0, 12)}...` : label;
          },
        },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: gridColor, drawTicks: false },
        ticks: {
          maxTicksLimit: 6,
          color: textColor,
          font: { family: "DM Sans", size: 11 },
          callback: (amount) => compactAmount(amount, selectedCurrency),
        },
      },
    },
    plugins: { legend: { display: false }, tooltip },
  };

  return (
    <ReportChartContext.Provider
      value={{
        categories,
        doughnutChartData,
        doughnutChartOptions,
        barChartData,
        barChartOptions,
      }}
    >
      {children}
    </ReportChartContext.Provider>
  );
};

export const useReportChartContext = () => useContext(ReportChartContext);
