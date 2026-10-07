import { describe, expect, it, vi } from "vitest";
import { buildAnomalyPrompt } from "../ai/prompts/anomaly.js";
import { buildBudgetCompliancePrompt } from "../ai/prompts/budget.js";
import { buildCashflowPrompt } from "../ai/prompts/cashflow.js";
import { buildFinancialRiskPrompt } from "../ai/prompts/risk.js";
import { buildOrchestrationPrompt } from "../ai/prompts/orchestrator.js";
import { buildCashflowData } from "../financial-signals/cashflow.js";
import { buildBudgetComplianceData } from "../financial-signals/budget.js";
import {
  exceedingBudgetsUser,
  expense,
  fixedSystemDate,
  income,
  normalUser,
} from "./fixtures/index.js";
import { assertPromptSanitized } from "./fixtures/fixture-validators.js";

const fullRiskData = isSystemicCrisis => ({
  risk: { score: isSystemicCrisis ? 88 : 52, level: isSystemicCrisis ? "HIGH" : "MEDIUM" },
  financial_facts: {
    has_active_income: true,
    income_consistency: "STABLE",
    spending_trend: "INCREASING",
    spending_pressure: "HIGH",
    recurring_pressure: true,
    budget_discipline: "WEAK",
    cashflow_health: isSystemicCrisis ? "RISK" : "SAFE",
    financial_stability: isSystemicCrisis ? "HIGH" : "MEDIUM",
    is_systemic_crisis: isSystemicCrisis,
  },
  signals: {
    anomaly_signals: { high_count: 2, total_anomalies: 2, medium_count: 0 },
    budget_signals: { exceeded_count: 2, at_risk_count: 1, compliance_rate: 50 },
    cashflow_signals: { outcome: "RISK", percent_spent: 92 },
    historical: { is_spending_increasing: true },
  },
});

const minimalRiskData = () => ({
  risk: { score: 35, level: "MEDIUM" },
  financial_facts: {
    has_active_income: true,
    income_consistency: "PARTIAL",
    spending_trend: "STABLE",
    spending_pressure: "LOW",
    recurring_pressure: false,
    budget_discipline: "GOOD",
    cashflow_health: "SAFE",
    financial_stability: "MEDIUM",
    is_systemic_crisis: false,
  },
  signals: {
    anomaly_signals: { high_count: 0, total_anomalies: 0, medium_count: 0 },
    budget_signals: { exceeded_count: 0, at_risk_count: 0, compliance_rate: 100 },
    cashflow_signals: { outcome: "SAFE", percent_spent: 20 },
    historical: { is_spending_increasing: false },
  },
});

const currency = "NGN";

describe("prompt builders", () => {
  it("includes systemic crisis instructions only when systemic crisis is present", () => {
    const crisisPrompt = buildFinancialRiskPrompt({ riskData: fullRiskData(true) });
    const normalPrompt = buildFinancialRiskPrompt({ riskData: fullRiskData(false) });

    expect(crisisPrompt).toContain("Multiple serious financial problems are happening at the same time.");
    expect(normalPrompt).not.toContain("Multiple serious financial problems are happening at the same time.");
  });

  it("includes every major financial-risk signal when present and omits absent ones", () => {
    const fullPrompt = buildFinancialRiskPrompt({ riskData: fullRiskData(true) });
    const minimalPrompt = buildFinancialRiskPrompt({ riskData: minimalRiskData() });

    expect(fullPrompt).toContain("Severe spending spikes detected: 2");
    expect(fullPrompt).toContain("Budgets completely exceeded: 2");
    expect(fullPrompt).toContain("Spending pressure level: HIGH");
    expect(fullPrompt).toContain("Cashflow health: RISK");

    expect(minimalPrompt).toContain("Severe spending spikes detected: 0");
    expect(minimalPrompt).toContain("Budgets completely exceeded: 0");
    expect(minimalPrompt).toContain("Spending pressure level: LOW");
    expect(minimalPrompt).toContain("Cashflow health: SAFE");
  });

  it("never leaks undefined, null, or NaN into financial-risk prompts", () => {
    assertPromptSanitized(buildFinancialRiskPrompt({ riskData: fullRiskData(true) }));
    assertPromptSanitized(buildFinancialRiskPrompt({ riskData: minimalRiskData() }));
  });

  it("injects cashflow context fields and marks risk only for at-risk cashflow data", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const riskPrompt = buildCashflowPrompt({
      cashflowData: buildCashflowData({
        transactions: [
          income({ id: "income-jun", amount: 4000, month: 6 }),
          expense({ id: "spend-jun", category: "Food", amount: 4150, month: 6, day: 10 }),
        ],
        currency,
      }),
    });
    const safeCashflowData = buildCashflowData({ transactions: normalUser.transactions, currency });

    expect(riskPrompt).toContain("Recorded income:");
    expect(riskPrompt).toContain("Recorded spending:");
    expect(riskPrompt).toContain("Days remaining:");
    expect(riskPrompt).toContain("Outcome: RISK");
    expect(safeCashflowData).toBeNull();
    assertPromptSanitized(riskPrompt);

    vi.useRealTimers();
  });

  it("builds anomaly prompts with required category and spending context", () => {
    const anomaly = {
      category: "Food",
      currency: "USD",
      risk: { level: "HIGH" },
      signal: {
        month: "2026, Jun",
        current_value: 900,
        baseline_value: 500,
        deviation_percent: 80,
      },
      context: {
        highest_in_period: true,
        recent_history: [{ month: "2026, May", total: 500 }],
      },
      impact: { impact_hint: "may affect balance" },
    };

    const prompt = buildAnomalyPrompt({ anomaly });

    expect(prompt).toContain("Food spending in 2026, Jun");
    expect(prompt).toContain("This is the highest in recent months.");
    expect(prompt.length).toBeLessThan(6000);
    assertPromptSanitized(prompt);
  });

  it("builds budget prompts with compliance numbers and status tone", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const compliance = buildBudgetComplianceData({
      budget: exceedingBudgetsUser.budgets[0],
      transactions: exceedingBudgetsUser.transactions,
      currency
    });
    const prompt = buildBudgetCompliancePrompt({ complianceData: compliance });

    expect(prompt).toContain("Category: Food");
    expect(prompt).toContain("Status: EXCEEDED");
    expect(prompt).toContain("Days remaining:");
    expect(prompt.length).toBeLessThan(6000);
    assertPromptSanitized(prompt);

    vi.useRealTimers();
  });

  it("keeps orchestration prompts compact and injects required signal fields", () => {
    const prompt = buildOrchestrationPrompt({
      signals: [
        {
          id: "risk-jun",
          type: "financial-risk",
          severity: "HIGH",
          urgencyScore: 78,
          orchestrationContext: { riskScore: 88, exceededBudgets: 2 },
        },
      ],
    });

    expect(prompt).toContain("ID: risk-jun");
    expect(prompt).toContain("TYPE: financial-risk");
    expect(prompt).toContain("SEVERITY: HIGH");
    expect(prompt).toContain("URGENCY SCORE: 78");
    expect(prompt.length).toBeLessThan(6000);
    assertPromptSanitized(prompt);
  });

  it("includes required cashflow and budget context for bank-grade explanations", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(fixedSystemDate));

    const cashflowPrompt = buildCashflowPrompt({
      cashflowData: buildCashflowData({
        transactions: [
          income({ id: "income-jun", amount: 4000, month: 6 }),
          expense({ id: "spend-jun", category: "Food", amount: 4150, month: 6, day: 10 }),
        ],
        currency,
      }),
    });
    const budgetPrompt = buildBudgetCompliancePrompt({
      complianceData: buildBudgetComplianceData({
        budget: exceedingBudgetsUser.budgets[0],
        transactions: exceedingBudgetsUser.transactions,
        currency
      }),
    });

    expect(cashflowPrompt).toContain("Return ONLY valid JSON");
    expect(budgetPrompt).toContain("Return ONLY JSON");
    assertPromptSanitized(cashflowPrompt);
    assertPromptSanitized(budgetPrompt);

    vi.useRealTimers();
  });
});
