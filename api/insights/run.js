import { loadFinancialData } from "../../backend/userData/loadFinancialData.js";
import { runFinancialSignals } from "../../backend/financial-signals/runFinancialSignals.js";
import { runOrchestrator } from "../../backend/ai/services/orchestrator.js";
import { recordFinancialBehaviourTelemetry } from "../../backend/ai/telemetry/businessBehaviourTelemetry.js";
import { loadPilotContext } from "../../backend/userData/loadPilotContext.js";
import { requireUser, sendUserAuthError } from "../../backend/auth/requireUser.js";

export default async function handler(req, res) {
    if(req.method !== "POST") {
        return res.status(405).json({
            error: "METHOD_NOT_ALLOWED",
            message: "Only post request are supported."
        });
    }

    const { userId, currency, isDemo = false } = req.body || {};

    if (!userId) {
        return res.status(400).json({
            error: "MISSING_USER_ID",
            message: "Missing userId"
        });
    }

    const authResult = await requireUser(req, userId);
    if (!authResult.ok) return sendUserAuthError(res, authResult);

    if (authResult.claims.email_verified !== true) {
        return sendUserAuthError(res, {
            ok: false,
            status: 403,
            error: {
                code: "EMAIL_VERIFICATION_REQUIRED",
                message: "Verify your email address before generating insights.",
            },
        });
    }

    try {
        const { transactions, budgets } = await loadFinancialData({ userId });

        const { anomalies, budgetComplianceList, cashflowData, riskData } = runFinancialSignals({
            transactions,
            budgets,
            currency
        });

        const pilotContext = await loadPilotContext({ userId });

        await recordFinancialBehaviourTelemetry({
            userId,
            ...pilotContext,
            budgetComplianceList,
            anomalies
        })

        const result = await runOrchestrator({ 
            userId, 
            ...pilotContext,
            anomalies, 
            budgetComplianceList, 
            cashflowData, 
            riskData, 
            isDemo 
        });

        return res.status(200).json({
            ...result
        })
    } catch (err) {
        console.error("INSIGHT_RUN_FAILED:", err);

        return res.status(500).json({
            error: "INSIGHT_RUN_FAILED",
            message: err.message || "Insight pipeline failed"
        });
    }
}
