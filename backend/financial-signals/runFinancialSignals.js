import { detectAnomalies } from "./anomaly.js";
import { buildBudgetComplianceData } from "./budget.js";
import { buildCashflowData } from "./cashflow.js";
import { buildRiskData } from "./risk.js";

export const runFinancialSignals = ({
    transactions = [],
    budgets = [],
    currency,
}) => {
    const anomalies = transactions.length ? detectAnomalies({ transactions, currency }) : [];

    const budgetComplianceList = transactions.length && budgets.length
        ? budgets
            .map(budget => buildBudgetComplianceData({ budget, transactions, currency }))
            .filter(Boolean)
        : [];

    const cashflowData = transactions.length ? buildCashflowData({ transactions, currency }) : null;

    const riskData = transactions.length
    ? buildRiskData({
        anomalies, 
        budgetCompliance: budgetComplianceList,
        cashflowData,
        transactions,
        currency
    })
    : null;

    return {
        anomalies,
        budgetComplianceList,
        cashflowData,
        riskData
    };
};
