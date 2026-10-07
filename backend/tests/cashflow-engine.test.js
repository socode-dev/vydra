import { describe, expect, it, vi } from "vitest";
import { buildCashflowData } from "../financial-signals/cashflow.js";
import {
  cashflowBreakEvenUser,
  cashflowWithFutureTransactionsUser,
  edgeCaseUsers,
  expense,
  fixedSystemDate,
  income,
  incomeAfterSpendingUser,
  monthIsolationUser,
  multipleIncomeSourcesUser,
  noIncomeUser,
  normalUser,
} from "./fixtures/index.js";

const expectNetCashflowInvariant = result => {
  expect(result.derived.net_cashflow).toBe(
    Number((result.income.total - result.spending.total_spent).toFixed(2)),
  );
};

describe("cashflow engine", () => {
  it("returns null for normal healthy current-month spending", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: normalUser.transactions, currency: "NGN"});

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("flags current-month cashflow risk when spending exceeds recorded income", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({
      transactions: [
        income({ id: "income-jun", amount: 4000, month: 6 }),
        expense({ id: "spend-jun", category: "Food", amount: 4150, month: 6, day: 10 }),
      ],
      currency: "NGN",
    });

    expect(result.outcome).toBe("RISK");
    expect(result.derived.percent_spent).toBe(104);
    expect(result.derived.net_cashflow).toBe(-150);
    expectNetCashflowInvariant(result);

    vi.useRealTimers();
  });

  it("captures a warning when spending is disproportionate early in the month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-05T12:00:00.000Z"));

    const warningUser = {
      ...normalUser,
      transactions: [
        income({ id: "income-jun", amount: 4000, month: 6 }),
        expense({ id: "spend-jun", category: "Food", amount: 1700.1, month: 6, day: 4 }),
      ],
    };

    const result = buildCashflowData({ transactions: warningUser.transactions, currency: "NGN" });

    expect(result.outcome).toBe("WARNING");
    expect(result.derived.percent_spent).toBe(43);
    expectNetCashflowInvariant(result);

    vi.useRealTimers();
  });

  it("marks spending without income as risk", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: noIncomeUser.transactions, currency: "NGN" });

    expect(result.derived.has_no_income).toBe(true);
    expect(result.outcome).toBe("RISK");
    expect(result.derived.net_cashflow).toBe(-result.spending.total_spent);
    expectNetCashflowInvariant(result);

    vi.useRealTimers();
  });

  it("returns null for empty transactions because there is no cashflow risk", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: edgeCaseUsers.emptyTransactions.transactions, currency: "NGN" });

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("returns null when income covers earlier spending without a disproportionate pace", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: incomeAfterSpendingUser.transactions, currency: "NGN" });

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("aggregates multiple income sources into total income", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: multipleIncomeSourcesUser.transactions, currency: "NGN" });

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("isolates current-month cashflow from previous-month expenses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: monthIsolationUser.transactions, currency: "NGN" });

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("returns deterministic cashflow output for identical data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const runs = Array.from({ length: 3 }, () =>
      buildCashflowData({ transactions: normalUser.transactions, currency: "NGN" })
    );

    expect(runs).toEqual([null, null, null]);

    vi.useRealTimers();
  });

  it("ignores future-month transactions when calculating current cashflow", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({
      transactions: cashflowWithFutureTransactionsUser.transactions,
      currency: "NGN"
    });

    expect(result).toBeNull();

    vi.useRealTimers();
  });

  it("handles the boundary when spending exactly equals income", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const result = buildCashflowData({ transactions: cashflowBreakEvenUser.transactions, currency: "NGN" });

    expect(result.income.total).toBe(4000);
    expect(result.spending.total_spent).toBe(4000);
    expect(result.derived.percent_spent).toBe(100);
    expect(result.derived.net_cashflow).toBe(0);
    expect(result.outcome).toBe("RISK");
    expectNetCashflowInvariant(result);

    vi.useRealTimers();
  });

  it("marks spending above income as risk", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const overspendUser = {
      ...cashflowBreakEvenUser,
      transactions: [
        ...cashflowBreakEvenUser.transactions,
        expense({ id: "extra-jun", category: "Shopping", amount: 250, month: 6, day: 14 }),
      ],
    };

    const result = buildCashflowData({ transactions: overspendUser.transactions, currency: "NGN" });

    expect(result.spending.total_spent).toBeGreaterThan(result.income.total);
    expect(result.outcome).toBe("RISK");

    vi.useRealTimers();
  });
});
