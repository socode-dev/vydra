export const normalizeSignals = ({
    anomalies, 
    budgetComplianceList, 
    cashflowData, 
    riskData
}) => {
    const signals = [];

    // Anomalies 
    if(Array.isArray(anomalies)) {
        anomalies.forEach(item => {
            if(!item) return;

            signals.push({
                id: item.id,
                type: "anomaly",
                severity: item?.risk?.level || "MEDIUM",
                orchestrationContext: {
                    category: item.category,
                    deviationPercent: item?.signal?.deviation_percent,
                    trend: item?.signal?.trend,
                    intensity: item?.signal?.intensity,
                    impact: item?.impact?.impact_hint,
                    repeatedHistory: item?.context?.months_analyzed,
                },
                data: item
            })
        })
    }

    // Budget Compliance
    if(Array.isArray(budgetComplianceList)) {
        budgetComplianceList.forEach(item => {
            if(!item) return;

            signals.push({
                id: item.id,
                type: "budget",
                severity: item?.derived?.risk_level || "MEDIUM",
                orchestrationContext: {
                    category: item.category,
                    percentUsed: item?.derived?.percent_budget_used,
                    compliance: item?.derived?.compliance_status,
                    remainingBudget: item?.derived?.remaining_budget,
                    amountOverBudget: item?.derived?.amount_over_budget,
                },
                data: item
            })
        })
    }


    // Cashflow
    if(cashflowData) {
        signals.push({
            id: cashflowData?.id,
            type: "cashflow",
            severity: cashflowData?.outcome || "MEDIUM",
            orchestrationContext: {
                currentBalance: cashflowData?.spending?.current_balance,
                projectedBalance: cashflowData?.forecast?.projected_remaining_balance,
                spendingRunway: cashflowData?.forecast?.spending_runway_days,
                hasNoIncome: cashflowData?.derived?.has_no_income,
                projectionConfidence: cashflowData?.derived?.projection_confidence,
            },

            data: cashflowData
        })
    }

    // Financial risk
    if(riskData) {
        signals.push({
            id: riskData?.id,
            type: "financial-risk",
            severity: riskData?.risk?.level || "MEDIUM",
            orchestrationContext: {
                riskScore: riskData?.risk?.score,
                anomalyCount: riskData?.signals?.anomaly_signals?.total_anomalies,
                exceededBudgets: riskData?.signals?.budget_signals?.exceeded_count,
                cashflowOutcome: riskData?.signals?.cashflow_signals?.outcome,
                spendingTrend: riskData?.signals?.historical?.is_spending_increasing,
            },

            data: riskData
        });
    }

    return signals;
}
