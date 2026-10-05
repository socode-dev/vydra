import InsightHistoryRows from "./InsightHistoryRows";
import InsightHistoryFilters from "./InsightHistoryFilters";
import { useMemo, useState } from "react";
import { FiClock } from "react-icons/fi";
import Button from "../ui/Button";
import Pagination from "../ui/Pagination";
import { getInsightExplanation, toInsightDate } from "./insightPresentation";

const initialFilters = {
  type: "all",
  category: "all",
  severity: "all",
  status: "all",
  expiry: "",
};

const InsightHistoryTable = ({ histories = [] }) => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);

  const options = useMemo(
    () => ({
      type: [
        ...new Set(histories.map((history) => history.type).filter(Boolean)),
      ].sort(),
      category: [
        ...new Set(
          histories.map((history) => history.category).filter(Boolean),
        ),
      ].sort(),
      severity: [
        ...new Set(
          histories.map((history) => history.severity).filter(Boolean),
        ),
      ].sort(),
      status: [
        ...new Set(histories.map((history) => history.status).filter(Boolean)),
      ].sort(),
    }),
    [histories],
  );

  const filteredHistories = useMemo(() => {
    const expiresBefore = filters.expiry ? new Date(`${filters.expiry}T23:59:59.999`) : null;
    
    return histories
      .filter(
        (history) =>
          ["type", "category", "severity", "status"].every(
            (field) =>
              filters[field] === "all" || history[field] === filters[field],
          ) &&
          (!expiresBefore ||
            (toInsightDate(history.expiresAt) &&
              toInsightDate(history.expiresAt) <= expiresBefore)),
      )
      .sort(
        (a, b) =>
          (toInsightDate(b.createdAt)?.getTime() || 0) -
          (toInsightDate(a.createdAt)?.getTime() || 0),
      );
  }, [histories, filters]);

  const pages = Math.max(1, Math.ceil(filteredHistories.length / 10));
  const currentPage = Math.min(page, pages);
  const rows = filteredHistories.slice((currentPage - 1) * 10, currentPage * 10);
  const hasFilters = Object.keys(initialFilters).some(key => filters[key] !== initialFilters[key]);

  const update = (field) => (event) => {
    setFilters((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
    setPage(1);
  };

  const reset = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  const explanation = (history) =>
    getInsightExplanation(history) || "No explanation recorded.";

  return (
    <div className="space-y-5">
      <h2 className="sr-only">Insight history</h2>
      {histories.length > 0 && (
        <InsightHistoryFilters
          filters={filters}
          update={update}
          options={options}
          hasFilters={hasFilters}
          reset={reset}
        />
      )}

      {rows.length ? (
        <>
          <p className="sr-only" aria-live="polite">
            Showing {(currentPage - 1) * 10 + 1}-
            {Math.min(currentPage * 10, filteredHistories.length)} of{" "}
            {filteredHistories.length} records
          </p>
          <InsightHistoryRows rows={rows} explanation={explanation} />
          <Pagination
            label="Insight history pagination"
            page={currentPage}
            pages={pages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <span className="grid size-12 place-items-center rounded-lg bg-info-soft text-2xl text-primary">
            <FiClock aria-hidden="true" />
          </span>
          <h3 className="font-display text-xl font-semibold">
            {histories.length ? "No matching insights" : "No insight history"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {histories.length
              ? "No insight history matches your filters."
              : "Your insight records will appear here when available."}
          </p>
          {hasFilters && (
            <Button variant="outline" onClick={reset}>
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default InsightHistoryTable;
