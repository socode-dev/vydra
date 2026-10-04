import { Line } from "react-chartjs-2";
import { useEffect, useRef } from "react";
import { useOverviewChartContext } from "../../context/OverviewChartContext";
import { formatAmount } from "../../utils/formatAmount";
import useCurrencyStore from "../../store/useCurrencyStore";
import { Link } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import { getCustomerPath, getDemoPath, useDemoMode } from "../../demo/useDemoMode";
import Button from "../ui/Button";

const hoverVerticalLine = (gridColor) => {

  return {
    id: "hoverVerticalLine",
    afterDraw: (chart) => {
      if (chart.tooltip?._active && chart.tooltip._active.length) {
        const activePoint = chart.tooltip._active[0];
        const { ctx } = chart;
        const { x } = activePoint.element;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = gridColor;
        ctx.setLineDash([4, 5]);
        ctx.stroke();
        ctx.restore();
      }
    },
  };
};

export const ChartSummary = ({ id, children }) => (
  <p id={id} className="sr-only">
    {children}
  </p>
);

const LineChart = () => {
  const chartRef = useRef(null);
  const chartContext = useOverviewChartContext();
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const isDemoMode = useDemoMode();

  useEffect(() => {
    const chart = chartRef.current;
    return () => {
      chart?.destroy();
    };
  }, []);

  const incomeVsExpensesData = chartContext.incomeVsExpensesData;
  const incomeVsExpensesOptions = chartContext.incomeVsExpensesOptions;
  const { labels, datasets } = incomeVsExpensesData;
  const incomeDataset = datasets.find((dataset) => dataset.label === "Income");
  const expensesDataset = datasets.find(dataset => dataset.label === "Expenses");
  
  const linseSummary = labels
    .map(
      (month, index) =>
        `${month}: income ${formatAmount(incomeDataset.data[index], selectedCurrency)}, expenses ${formatAmount(expensesDataset.data[index], selectedCurrency)}`,
    )
    .join(". ");
  
  const gridColor = chartContext.gridColor;
  const hoverVerticalLinePlugin = hoverVerticalLine(gridColor);
  
  return (
    <div className="relative h-72 w-full min-w-0 sm:h-80">
      {!chartContext.hasTransactions ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 p-4 text-center text-muted-foreground">
          <FiTrendingUp aria-hidden="true" size={28} />
          <p className="text-sm font-medium text-foreground">
            No income or expenses data available.
          </p>
          <Button
            as={Link}
            to={isDemoMode ? getDemoPath("/transactions") : getCustomerPath("/transactions")}
            variant="outline"
          >
            Add a transaction
          </Button>
        </div>
      ) : (
        <>
          <ChartSummary id="income-expenses-summary">
            Income and expenses by month. {linseSummary}
          </ChartSummary>

          <Line
            role="img"
            aria-label="Monthly income and expenses"
            aria-describedby="income-expenses-summary"
            ref={chartRef}
            data={incomeVsExpensesData}
            options={incomeVsExpensesOptions}
            plugins={[hoverVerticalLinePlugin]}
          />
        </>
      )}
    </div>
  );
};

export default LineChart;
