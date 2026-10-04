import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import InsightCard from "../insights/InsightCard";
import useInsightsStore from "../../store/useInsightsStore";
import { normalizeInsight } from "../../utils/normalizeInsight";
import { getCustomerPath, getDemoPath, useDemoMode } from "../../demo/useDemoMode";
import Button from "../ui/Button";

const severityRank = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const SmartInsight = () => {
  const insights = useInsightsStore((state) => state.insights);
  const isDemoMode = useDemoMode();
  const sortedInsights = useMemo(
    () =>
      (insights ?? [])
        .map(normalizeInsight)
        .filter(
          (insight) =>
            !["ACKNOWLEDGED", "DISMISSED", "EXPIRED"].includes(insight.status),
        )
        .sort(
          (a, b) =>
            (severityRank[b.severity?.toUpperCase()] || 0) -
              (severityRank[a.severity?.toUpperCase()] || 0) ||
            b.createdAt - a.createdAt,
        )
        .slice(0, 2),
    [insights],
  );

  return (
    <>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="min-w-0">
          <h2 className="font-display text-base font-semibold">Smart Insights</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Personalized tips, forecasts, and savings suggestions.
          </p>
        </div>
        <Button
          as={Link}
          to={isDemoMode ? getDemoPath("/insights") : getCustomerPath("/insights")}
          variant="ghost"
          className="shrink-0 px-2 text-[13px]"
        >
          All insights
        </Button>
      </header>
      {sortedInsights.length ? (
        <div className="space-y-4">
          {sortedInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} compact />
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center gap-4 p-6 text-center text-muted-foreground">
          <FiZap size={28} aria-hidden="true" />
          <p className="text-sm leading-relaxed">
            {insights?.length
              ? "No active insights need your attention."
              : "Not enough data yet. Insights will be generated as data grows."}
          </p>
        </div>
      )}
    </>
  );
};
export default SmartInsight;
