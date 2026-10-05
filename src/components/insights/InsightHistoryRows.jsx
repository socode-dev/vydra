import clsx from "clsx";
import { insightTypeLabel, formatInsightDate } from "./insightPresentation";
import InsightBadge from "./InsightBadge";
import Tooltip from "../ui/Tooltip";

export default function InsightHistoryRows({ rows, explanation }) {

  return (
    <div
      className="block overflow-x-auto"
      role="region"
      aria-label="Insight history table"
      tabIndex={0}
    >
      <table
        className={clsx(
          "w-full min-w-[900px] table-fixed border-collapse bg-card text-[13px] [&_th]:border-b [&_th]:border-border [&_th]:px-4",
          "[&_th]:py-3.5 [&_th]:text-left [&_th]:align-top [&_th]:wrap-anywhere [&_td]:border-b [&_td]:border-border [&_td]:px-4",
          "[&_td]:py-3.5 [&_td]:text-left [&_td]:align-top [&_td]:text-muted-foreground [&_td]:wrap-anywhere [&_thead]:bg-surface",
          "[&_thead]:text-muted-foreground [&_thead_th]:text-[11px] [&_thead_th]:font-medium [&_thead_th]:uppercase",
          "[&_tbody_tr:hover]:bg-surface",
        )}
      >
        <caption className="sr-only">Insight history and responses</caption>
        <colgroup>
          <col className="w-[110px]" />
          <col className="w-[130px]" />
          <col />
          <col className="w-[150px]" />
          <col className="w-[160px]" />
          <col className="w-[120px]" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Category</th>
            <th scope="col">Explanation</th>
            <th scope="col">Severity</th>
            <th scope="col">Status</th>
            <th scope="col">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((history) => (
            <tr key={history.id}>
              <th scope="row" className="font-medium">
                {insightTypeLabel(history.type)}
              </th>
              <td>{history.category || "N/A"}</td>
              <Tooltip content={explanation(history)} side="bottom">
                <td className="text-sm leading-relaxed text-muted-foreground wrap-anywhere">
                  <p className="line-clamp-2">{explanation(history)}</p>
                </td>
              </Tooltip>
              <td>
                <InsightBadge value={history.severity} severity />
              </td>
              <td>
                <InsightBadge value={history.status} />
              </td>
              <td>{formatInsightDate(history.expiresAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
