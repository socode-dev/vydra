import { describe, expect, it, vi } from "vitest";
import { detectAnomalies } from "../financial-signals/anomaly.js";
import { buildBudgetComplianceData } from "../financial-signals/budget.js";
import { buildCashflowData } from "../financial-signals/cashflow.js";
import { buildRiskData } from "../financial-signals/risk.js";
import {
  buildMultiCategorySpikeUser,
  cashflowRiskUser,
  budget,
  exceedingBudgetsUser,
  expense,
  fixedSystemDate,
  income,
  normalUser,
  threeCategoryOverspendingUser,
} from "./fixtures/index.js";

const currency = "NGN";

const toNgnTransactions = transactions =>
  transactions.map(transaction => ({
    ...transaction,
    amount: transaction.amount * 100,
  }));

const toNgnBudget = budget => ({
  ...budget,
  amount: budget.amount * 100,
});

const cashflowRiskData = () => buildCashflowData({
  transactions: toNgnTransactions([
    income({ id: "income-jun", amount: 4000, month: 6 }),
    expense({ id: "spend-jun", category: "Food", amount: 4150, month: 6, day: 10 }),
  ]),
  currency,
});

const complianceFor = user =>
  user.budgets.map(budget => buildBudgetComplianceData({
    budget: toNgnBudget(budget),
    transactions: toNgnTransactions(user.transactions),
    currency,
  }));

const highAnomaly = (id, category = "Food", deviation = 260) => ({
  id,
  category,
  risk: { level: "HIGH", score: 82 },
  signal: { deviation_percent: deviation },
  context: { highest_in_period: true },
});

const exceededBudgetCompliance = (id, category, percentUsed) => ({
  id,
  category,
  derived: {
    compliance_status: "EXCEEDED",
    percent_budget_used: percentUsed,
    risk_level: "HIGH",
  },
});

const riskScoreOrZero = riskData => riskData?.risk?.score ?? 0;

describe("financial risk engine", () => {
  it("returns null when the user's overall risk is low", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const risk = buildRiskData({
      anomalies: detectAnomalies({ transactions: toNgnTransactions(normalUser.transactions), currency }),
      budgetCompliance: complianceFor(normalUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(normalUser.transactions), currency }),
      transactions: toNgnTransactions(normalUser.transactions),
      currency
    });

    expect(risk).toBeNull();

    vi.useRealTimers();
  });

  it("marks systemic crisis as high when multiple high anomalies and exceeded budgets exist", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const user = {
      ...threeCategoryOverspendingUser,
      budgets: [
        budget({ id: "budget-food", category: "Food", amount: 400 }),
        budget({ id: "budget-shopping", category: "Shopping", amount: 250 }),
      ],
    };

    const risk = buildRiskData({
      anomalies: detectAnomalies({ transactions: toNgnTransactions(user.transactions), currency }),
      budgetCompliance: complianceFor(user),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(cashflowRiskUser.transactions), currency }),
      transactions: toNgnTransactions(user.transactions),
      currency
    });

    expect(risk.risk.level).toBe("HIGH");
    expect(risk.financial_facts.is_systemic_crisis).toBe(true);

    vi.useRealTimers();
  });

  it("keeps a boundary medium risk below high when there is no systemic crisis", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const risk = buildRiskData({
      anomalies: [
        highAnomaly("high-1", "Food", 320),
        highAnomaly("high-2", "Food", 300),
        highAnomaly("high-3", "Food", 280),
      ],
      budgetCompliance: [exceededBudgetCompliance("budget-food", "Food", 110)],
      cashflowData: cashflowRiskData(),
      transactions: toNgnTransactions(cashflowRiskUser.transactions),
      currency
    });

    expect(risk).not.toBeNull();
    expect(risk.risk.score).toBeLessThan(80);
    expect(risk.risk.level).toBe("MEDIUM");
    expect(risk.financial_facts.is_systemic_crisis).toBe(false);

    vi.useRealTimers();
  });

  it("does not automatically mark high financial risk from a high anomaly alone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const risk = buildRiskData({
      anomalies: [highAnomaly("high-anomaly-food")],
      budgetCompliance: complianceFor(normalUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(normalUser.transactions), currency }),
      transactions: toNgnTransactions(normalUser.transactions),
      currency
    });

    expect(risk).toBeNull();
    expect(risk?.financial_facts?.is_systemic_crisis).not.toBe(true);

    vi.useRealTimers();
  });

  it("scores high cashflow pressure according to current scoring without forcing high risk", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const risk = buildRiskData({
      anomalies: [],
      budgetCompliance: complianceFor(normalUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(cashflowRiskUser.transactions), currency }),
      transactions: toNgnTransactions(cashflowRiskUser.transactions),
      currency
    });

    expect(risk).toBeNull();

    vi.useRealTimers();
  });

  it("does not mark budget-only pressure as high risk by itself", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const risk = buildRiskData({
      anomalies: [],
      budgetCompliance: complianceFor(exceedingBudgetsUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(normalUser.transactions), currency }),
      transactions: toNgnTransactions(exceedingBudgetsUser.transactions),
      currency
    });

    expect(risk?.risk?.level ?? "LOW").not.toBe("HIGH");
    expect(risk?.financial_facts?.is_systemic_crisis ?? false).toBe(false);

    vi.useRealTimers();
  });

  it("requires enough combined evidence before medium risk is emitted", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const anomalyOnly = buildRiskData({
      anomalies: [highAnomaly("high-anomaly-food")],
      budgetCompliance: complianceFor(normalUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(normalUser.transactions), currency }),
      transactions: toNgnTransactions(normalUser.transactions),
      currency
    });

    const anomalyWithCashflowRisk = buildRiskData({
      anomalies: [
        highAnomaly("high-anomaly-food-1", "Food", 260),
        highAnomaly("high-anomaly-food-2", "Food", 250),
        highAnomaly("high-anomaly-food-3", "Food", 240),
      ],
      budgetCompliance: complianceFor(normalUser),
      cashflowData: cashflowRiskData(),
      transactions: toNgnTransactions(cashflowRiskUser.transactions),
      currency
    });

    expect(anomalyOnly).toBeNull();
    expect(anomalyWithCashflowRisk?.risk?.level).toBe("MEDIUM");
    expect(anomalyWithCashflowRisk?.financial_facts?.cashflow_health).toBe("RISK");

    vi.useRealTimers();
  });

  it("requires the full signal combination before systemic crisis is detected", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const risk = buildRiskData({
      anomalies: [highAnomaly("high-anomaly-food"), highAnomaly("high-anomaly-shopping", "Shopping")],
      budgetCompliance: complianceFor(normalUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(cashflowRiskUser.transactions), currency }),
      transactions: toNgnTransactions(normalUser.transactions),
      currency
    });

    expect(risk?.financial_facts?.is_systemic_crisis).not.toBe(true);

    vi.useRealTimers();
  });

  it("does not decrease risk score when worse financial signals are introduced", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const mild = buildRiskData({
      anomalies: [highAnomaly("high-anomaly-food")],
      budgetCompliance: complianceFor(normalUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(cashflowRiskUser.transactions), currency }),
      transactions: toNgnTransactions(cashflowRiskUser.transactions),
      currency
    });

    const worse = buildRiskData({
      anomalies: [highAnomaly("high-anomaly-food"), highAnomaly("high-anomaly-shopping", "Shopping")],
      budgetCompliance: complianceFor(exceedingBudgetsUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(cashflowRiskUser.transactions), currency }),
      transactions: toNgnTransactions(cashflowRiskUser.transactions),
      currency
    });

    const systemicUser = {
      ...buildMultiCategorySpikeUser(3),
      budgets: [
        budget({ id: "budget-food", category: "Food", amount: 200 }),
        budget({ id: "budget-shopping", category: "Shopping", amount: 200 }),
      ],
    };
    const crisis = buildRiskData({
      anomalies: detectAnomalies({ transactions: toNgnTransactions(systemicUser.transactions), currency }),
      budgetCompliance: complianceFor(systemicUser),
      cashflowData: buildCashflowData({ transactions: toNgnTransactions(cashflowRiskUser.transactions), currency }),
      transactions: toNgnTransactions(systemicUser.transactions),
      currency
    });

    expect(riskScoreOrZero(worse)).toBeGreaterThanOrEqual(riskScoreOrZero(mild));
    expect(riskScoreOrZero(crisis)).toBeGreaterThanOrEqual(riskScoreOrZero(worse));
    expect(crisis.financial_facts.is_systemic_crisis).toBe(true);

    vi.useRealTimers();
  });

  it("maps financial facts to the underlying signal pressure", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const manyAnomalies = Array.from({ length: 3 }, (_, index) =>
      highAnomaly(`anomaly-${index}`, `Category ${index}`, 220)
    );

    const risk = buildRiskData({
      anomalies: manyAnomalies,
      budgetCompliance: [exceededBudgetCompliance("budget-food", "Food", 120)],
      cashflowData: cashflowRiskData(),
      transactions: toNgnTransactions(exceedingBudgetsUser.transactions),
      currency
    });

    expect(risk.financial_facts.spending_pressure).toBe("HIGH");
    expect(risk.financial_facts.severe_spending_spikes).toBe(true);
    expect(risk.financial_facts.budget_discipline).toBe("WEAK");
    expect(risk.financial_facts.cashflow_health).toBe("RISK");
    expect(risk.signals.anomaly_signals.high_count).toBe(3);

    vi.useRealTimers();
  });
});
