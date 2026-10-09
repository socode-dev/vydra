import { parseISO, format, addMonths } from "date-fns";
import { getMedian, getMAD, getRiskScore } from "./utils.js";
import { v4 as uuidv4 } from "uuid";

export const detectAnomalies = ({ transactions, currency }) => {
  const MIN_HISTORY_MONTHS = 4;
  const ROBUST_Z_THRESHOLD = 3;
  const MIN_PERCENT_INCREASE = 25;
  const MIN_ABSOLUTE_INCREASE = currency === "NGN" ? 5000 : 50;

  const byCategoryMonth = {};
  const categoryMonths = {};
  let firstActivityMonth = null;

  transactions?.forEach((transaction) => {
    if (!transaction.date) return;

    const date = parseISO(transaction.date);
    if (isNaN(date.getTime())) return;

    const monthKey = format(date, "yyyy-MM");

    if (!firstActivityMonth || monthKey < firstActivityMonth) {
      firstActivityMonth = monthKey;
    }

    // Only expenses contribute to category spending.
    if (
      transaction.type !== "expense" ||
      !transaction.category ||
      typeof transaction.amount !== "number" ||
      !Number.isFinite(transaction.amount)
    ) {
      return;
    }

    const category = transaction.category;
    const key = `${category}__${monthKey}`;

    if (!byCategoryMonth[key]) {
      byCategoryMonth[key] = {
        total: 0,
        monthKey,
        monthLabel: format(date, "yyyy, MMM"),
      };
    }

    byCategoryMonth[key].total += transaction.amount;

    if (!categoryMonths[category]) {
      categoryMonths[category] = new Set();
    }

    categoryMonths[category].add(monthKey);
  });

  const categorySeries = {};

  Object.keys(categoryMonths).forEach((category) => {
    const observedMonths = [...categoryMonths[category]].sort();
    const latestMonth = observedMonths[observedMonths.length - 1];

    const series = [];
    let cursor = parseISO(`${firstActivityMonth}-01`);
    const end = parseISO(`${latestMonth}-01`);

    while (cursor <= end) {
      const monthKey = format(cursor, "yyyy-MM");
      const key = `${category}__${monthKey}`;
      const entry = byCategoryMonth[key];

      series.push({
        monthKey,
        month: format(cursor, "yyyy, MMM"),
        total: entry?.total ?? 0,
      });

      cursor = addMonths(cursor, 1);
    }

    categorySeries[category] = series;
  });

  const anomalies = [];

  Object.entries(categorySeries).forEach(([category, series]) => {
    const sortedSeries = [...series].sort((a, b) =>
      a.monthKey.localeCompare(b.monthKey)
    );

    const values = sortedSeries.map((s) => s.total);

    const latestIndex = sortedSeries.length - 1;
    const { month, total } = sortedSeries[latestIndex];
    const historyValues = values.slice(0, -1);

    if (historyValues.length < MIN_HISTORY_MONTHS) return;

    const median = getMedian(historyValues);
    const mad = getMAD(historyValues, median) || 1e-6;

    const deviationPercent =
      median !== 0
        ? ((total - median) / median) * 100
        : total > 0
          ? Infinity
          : 0;

    const historyMin = Math.min(...historyValues);
    const historyMax = Math.max(...historyValues);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);

    const robustZ = Math.abs(
      (total - median) / (1.4826 * mad)
    );

    const deviationAbsolute = total - median;

    const isMeaningfulIncrease =
      total > median &&
      total > historyMax &&
      deviationAbsolute >= MIN_ABSOLUTE_INCREASE &&
      deviationPercent >= MIN_PERCENT_INCREASE;

    if (robustZ < ROBUST_Z_THRESHOLD || !isMeaningfulIncrease) {
      return;
    }

    const previous = values[latestIndex - 1] ?? median;

    const trend =
      total > previous
        ? "increasing"
        : total < previous
          ? "decreasing"
          : "stable";

    const riskScore = getRiskScore(robustZ);

    const deviationLabel =
      deviationPercent >= 0
        ? `${Math.round(deviationPercent)}% more`
        : `${Math.abs(Math.round(deviationPercent))}% less`;

    const recentHistory = sortedSeries.slice(-5, -1);
    const formattedHistory = recentHistory.map((item) => ({
      month: item.month,
      total: item.total,
    }));

    anomalies.push({
      id: `anomaly_${uuidv4()}`,
      type: "anomaly",
      category,
      currency,
      timestamp: new Date().toISOString(),

      risk: {
        score: riskScore,
        level: robustZ >= 5 ? "HIGH" : "MEDIUM",
        confidence: 0.8,
      },

      signal: {
        metric: "spending",
        month,
        current_value: total,
        baseline_value: median,
        deviation_percent: Math.round(deviationPercent),
        deviation_label: deviationLabel,
        deviation_absolute: Math.round(deviationAbsolute),
        robust_z_score: Number(robustZ.toFixed(2)),
        intensity: robustZ >= 5 ? "extreme" : "moderate",
        trend,
      },

      context: {
        months_analyzed: historyValues.length,
        highest_in_period: total === maxVal,
        lowest_in_period: total === minVal,
        previous_highest_value: historyMax,
        previous_lowest_value: historyMin,
        previous_value: previous,
        recent_history: formattedHistory,
      },

      impact: {
        type: "unusual_spending",
        severity: robustZ >= 5 ? "HIGH" : "MEDIUM",
        impact_hint: "Spending is unusually high compared with recorded history",
      },

      recommendation: {
        action_type: "investigate_spending",
        action_hint: `Identify what contributed to unusual ${category} spending`,
      },
    });
  });

  return anomalies;
};
