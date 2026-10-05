import {toNumber, toTrigger, nullableNumber} from "./utils.js"

export const TRIGGER_BUILDERS = {
    anomaly: signal => {
        const data = signal.data;
        const category = data.category ?? "unknown";
        const month = data.signal?.month ?? "unknown";
        const snapshot = {
            category,
            month,
            severity: data.risk?.level ?? signal.severity ?? null,
            currentValue: toNumber(data.signal?.current_value),
            baselineValue: toNumber(data.signal?.baseline_value),
            deviationPercent: toNumber(data.signal?.deviation_percent),
        };

        return toTrigger({
            type: "anomaly",
            keyParts: ["anomaly", category, month],
            snapshot,
        });
    },

    budget: signal => {
        const data = signal.data;
        const category = data.category ?? "unknown";
        const month = data.budget?.month ?? "unknown";
        const year = data.budget?.year ?? "unknown";
        const snapshot = {
            category,
            month,
            year,
            severity: data.derived?.risk_level ?? signal.severity ?? null,
            percentUsed: toNumber(data.derived?.percent_budget_used),
            compliance: data.derived?.compliance_status ?? null,
            remainingBudget: toNumber(data.derived?.remaining_budget),
            amountOverBudget: toNumber(data.derived?.amount_over_budget),
        };

        return toTrigger({
            type: "budget",
            keyParts: ["budget", category, month, year],
            snapshot,
        });
    },

    cashflow: signal => {
        const data = signal.data;
        const month = data.period?.month ?? "unknown";
        const year = data.period?.year ?? "unknown";
        const snapshot = {
            month,
            year,
            outcome: data.outcome ?? signal.severity ?? null,
            percentSpent: toNumber(data.derived?.percent_spent),
            hasNoIncome: Boolean(data.derived?.has_no_income),
            spendingRunway: nullableNumber(data.forecast?.spending_runway_days),
            projectedTotalSpend: nullableNumber(data.forecast?.projected_total_spend),
            projectedRemainingBalance: nullableNumber(data.forecast?.projected_remaining_balance),
            currentBalance: toNumber(data.spending?.current_balance),
            totalSpent: toNumber(data.spending?.total_spent),
            incomeTotal: toNumber(data.income?.total),
        };

        return toTrigger({
            type: "cashflow",
            keyParts: ["cashflow", month, year],
            snapshot,
        });
    },

    "financial-risk": signal => {
        const data = signal.data;
        const month = data.period?.month ?? "unknown";
        const year = data.period?.year ?? "unknown";
        const snapshot = {
            month,
            year,
            level: data.risk?.level ?? signal.severity ?? null,
            score: toNumber(data.risk?.score),
            cashflowHealth: data.financial_facts?.cashflow_health ?? null,
            spendingTrend: data.financial_facts?.spending_trend ?? null,
            budgetDiscipline: data.financial_facts?.budget_discipline ?? null,
            systemicCrisis: Boolean(data.financial_facts?.is_systemic_crisis),
        };

        return toTrigger({
            type: "financial-risk",
            keyParts: ["risk", month, year],
            snapshot,
        });
    },
};
