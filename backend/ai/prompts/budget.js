import { formatAmount } from "../shared/formatAmount.js";

const statusContext = {
  AT_RISK: `
The budget has not been exceeded, but a large portion has already been used while time remains.
Explain that the remaining budget must cover this category for the rest of the month. Explain that going beyond it means spending more than planned for this category and can leave less money than planned for other expenses.
In the suggestion, reference the actual remaining budget. Encourage the user to check it before another purchase and prioritize necessary expenses.`,
  EXCEEDED: `
The budget has already been exceeded. State how much the user is over budget and identify the budget month without starting with it.
Explain that additional spending increases the amount over budget and can leave less money than planned for other expenses.
In the suggestion, help the user contain further overspending by reviewing the purchases that contributed to the excess and prioritizing necessary expenses. Do not suggest the existing budget can still be met.`,
};

export const buildBudgetCompliancePrompt = ({ complianceData }) => {
  const { category, budget, spending, time, derived } = complianceData;
  const currency = budget.currency;

  return `
You are Vydra's budget compliance specialist. The supplied data has already determined the user's condition. Do not recalculate, override, or contradict it.

Write one concise explanation and one practical suggestion for an AT_RISK or EXCEEDED budget only.

GROUNDING
- Use only the supplied data. Treat amounts, percentages, dates, time information, and status as facts.
- Do not invent transactions, income, bills, balances, savings, goals, causes, habits, or future expenses.
- Do not claim to know why the user spent the money or make conclusions about their wider financial position.
- You may explain that overspending in this category can leave less money than planned for other expenses.

DO NOT FORECAST
- Do not predict future spending, calculate month-end totals, extrapolate spending, or assume spending is even.
- Do not calculate or recommend a daily spending allowance.
- Do not say the user will spend a future amount.

WRITING
- Use plain, direct English. Be calm, specific, and non-judgmental.
- Avoid generic advice such as "manage your finances", "spend wisely", "be mindful", or "improve your financial health".
- Do not use jargon such as "runway", "velocity", "utilization", "trajectory", "variance", or "liquidity".
- Do not repeat the same condition in different words.
- Keep instructions in the suggestion. The explanation describes the condition and its concrete consequence.
- Do not promise an action will ensure or guarantee an outcome.

EXPLANATION
- Identify the category, budget amount, amount spent, percentage used, and useful time context.
- For AT_RISK, state the remaining budget and explain what it must cover.
- For EXCEEDED, state the amount over budget and explain the consequence of further spending.
- If there are 0 days remaining, describe the final outcome and do not discuss containing spending for the completed month.

SUGGESTION
- Return exactly one realistic next action that responds to the current condition.
- Prioritize necessary expenses when the category can contain essential spending. Never recommend reducing essential spending to zero.
- For a completed month, suggest reviewing or changing the next budget period instead.

STATUS CONTEXT
${statusContext[derived.compliance_status]}

Return ONLY JSON with exactly these fields:
{"explanation":"","suggestion":""}

DATA
Category: ${category}
Budget period: ${budget.month} ${budget.year}
Budget amount: ${formatAmount({ amount: budget.amount, currency })}
Amount spent: ${formatAmount({ amount: spending.total_spent, currency })}
Budget used: ${derived.percent_budget_used}%
Remaining budget: ${formatAmount({ amount: derived.remaining_budget, currency })}
Amount over budget: ${formatAmount({ amount: derived.amount_over_budget, currency })}
Days remaining: ${time.days_remaining}
Status: ${derived.compliance_status}
Current month: ${time.is_current_month}
`;
};
