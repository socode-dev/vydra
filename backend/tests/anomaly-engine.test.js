import { describe, expect, it } from "vitest";
import { detectAnomalies } from "../financial-signals/anomaly.js";
import {
  buildMultiCategorySpikeUser,
  edgeCaseUsers,
  independentCategorySpikeUser,
  limitedHistoryUser,
  mediumSeverityAnomalyUser,
  newCategoryUser,
  oneCategoryOverspendingUser,
  persistentSpikeUser,
  refundUser,
  sparseHistoryTwoMonthUser,
  steadySpendingUser,
  threeCategoryOverspendingUser,
} from "./fixtures/index.js";

const deterministicAnomalies = anomalies =>
  anomalies.map(anomaly => {
    const deterministicAnomaly = { ...anomaly };
    delete deterministicAnomaly.id;
    delete deterministicAnomaly.timestamp;

    return {
      ...deterministicAnomaly,
      risk: { ...deterministicAnomaly.risk },
      signal: { ...deterministicAnomaly.signal },
      context: { ...deterministicAnomaly.context },
      impact: { ...deterministicAnomaly.impact },
      recommendation: { ...deterministicAnomaly.recommendation },
    };
  });

const latestMonthLabel = "2026, Jun";
const toNgnTransactions = transactions =>
  transactions.map(transaction => ({
    ...transaction,
    amount: transaction.amount * 100,
  }));

describe("anomaly engine", () => {
  it("returns anomaly signals when spending breaks recorded category history", () => {
    const result = detectAnomalies({transactions: toNgnTransactions(oneCategoryOverspendingUser.transactions), currency: "NGN"});
    const foodAnomaly = result.find(anomaly => anomaly.category === "Food");

    expect(result).toHaveLength(2);
    expect(result.map(anomaly => anomaly.category)).toEqual(["Food", "Transport"]);
    expect(foodAnomaly).toMatchObject({
      type: "anomaly",
      category: "Food",
      risk: { level: "HIGH" },
      signal: {
        current_value: 90000,
        baseline_value: 50000,
        deviation_percent: 80,
        month: latestMonthLabel,
      },
    });
  });

  it("captures the boundary where at least two high anomalies exist", () => {
    const result = detectAnomalies({ transactions: toNgnTransactions(threeCategoryOverspendingUser.transactions), currency: "NGN" });
    const highAnomalies = result.filter(anomaly => anomaly.risk.level === "HIGH");

    expect(highAnomalies.length).toBeGreaterThanOrEqual(2);
  });

  it.each([2, 3, 5, 10])("detects %i independent category anomalies when each category spikes", count => {
    const user = buildMultiCategorySpikeUser(count);
    const result = detectAnomalies({ transactions: toNgnTransactions(user.transactions), currency: "NGN" });

    expect(result.length).toBe(count);
    expect(new Set(result.map(anomaly => anomaly.category)).size).toBe(count);
  });

  it("never flags stable monthly spending as an anomaly", () => {
    expect(detectAnomalies({ transactions: toNgnTransactions(steadySpendingUser.transactions), currency: "NGN" })).toEqual([]);
  });

  it("uses only prior months as baseline and never compares June against itself", () => {
    const result = detectAnomalies({ transactions: toNgnTransactions(oneCategoryOverspendingUser.transactions), currency: "NGN" })[0];

    expect(result.signal.month).toBe(latestMonthLabel);
    expect(result.context.months_analyzed).toBe(5);
    expect(result.context.recent_history.every(entry => entry.month !== latestMonthLabel)).toBe(true);
    expect(result.context.recent_history.map(entry => entry.total)).toEqual([50000, 50000, 50000, 50000]);
  });

  it("assigns HIGH severity for extreme spikes and MEDIUM for moderate spikes", () => {
    const high = detectAnomalies({ transactions: toNgnTransactions(oneCategoryOverspendingUser.transactions), currency: "NGN"})[0];
    const medium = detectAnomalies({ transactions: toNgnTransactions(mediumSeverityAnomalyUser.transactions), currency: "NGN" });

    expect(high.risk.level).toBe("HIGH");
    expect(high.signal.intensity).toBe("extreme");
    expect(medium).toHaveLength(1);
    expect(medium[0].risk.level).toBe("MEDIUM");
    expect(medium[0].signal.intensity).toBe("moderate");
  });

  it("isolates a Food spike from Transport, Shopping, and Rent baselines", () => {
    const result = detectAnomalies({ transactions: toNgnTransactions(independentCategorySpikeUser.transactions), currency: "NGN" });

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe("Food");
    expect(result.map(anomaly => anomaly.category)).not.toContain("Transport");
    expect(result.map(anomaly => anomaly.category)).not.toContain("Shopping");
    expect(result.map(anomaly => anomaly.category)).not.toContain("Rent");
  });

  it("flags a new category after sufficient account activity establishes zero-spend history", () => {
    const result = detectAnomalies({ transactions: toNgnTransactions(newCategoryUser.transactions), currency: "NGN"});

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      category: "Gadgets",
      risk: { level: "HIGH" },
      signal: {
        baseline_value: 0,
        current_value: 80000,
      },
      context: {
        months_analyzed: 5,
        previous_highest_value: 0,
      },
    });
  });

  it("refuses to emit a signal when only two months of history exist", () => {
    expect(detectAnomalies({ transactions: toNgnTransactions(sparseHistoryTwoMonthUser.transactions), currency: "NGN" })).toEqual([]);
    expect(detectAnomalies({ transactions: toNgnTransactions(limitedHistoryUser.transactions), currency: "NGN" })).toEqual([]);
  });

  it("does not treat refunds as spending spikes", () => {
    expect(detectAnomalies({ transactions: toNgnTransactions(refundUser.transactions), currency: "NGN" })).toEqual([]);
  });

  it("returns no anomaly for empty transactions", () => {
    expect(detectAnomalies({ transactions: toNgnTransactions(edgeCaseUsers.emptyTransactions.transactions), currency: "NGN" })).toEqual([]);
  });

  it("ignores invalid dates instead of producing a false signal", () => {
    expect(detectAnomalies({ transactions: toNgnTransactions(edgeCaseUsers.invalidDates.transactions), currency: "NGN" })).toEqual([]);
  });

  it("does not create duplicate anomaly signals for persistent high spending", () => {
    const result = detectAnomalies({ transactions: toNgnTransactions(persistentSpikeUser.transactions), currency: "NGN"});

    expect(result.length).toBeLessThanOrEqual(1);
    expect(new Set(result.map(anomaly => anomaly.category)).size).toBe(result.length);
  });

  it("returns deterministic financial anomaly content for the same dataset", () => {
    const runs = Array.from({ length: 3 }, () =>
      deterministicAnomalies(detectAnomalies({ transactions: toNgnTransactions(oneCategoryOverspendingUser.transactions), currency: "NGN" }))
    );

    expect(runs[1]).toEqual(runs[0]);
    expect(runs[2]).toEqual(runs[0]);
  });
});
