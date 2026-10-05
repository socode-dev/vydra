import { formatAmount } from "../shared/formatAmount.js";

export const fallback = ({ complianceData }) => {
  const { category, budget, spending, time, derived } = complianceData;

  if (!category || !budget || !spending || !time || !derived) {
    throw new Error("Budget complianceData not complete");
  }

  const currency = budget.currency;
  const budgetAmount = formatAmount({ amount: budget.amount, currency });
  const spent = formatAmount({ amount: spending.total_spent, currency });
  const remainingBudget = formatAmount({ amount: derived.remaining_budget, currency });
  const amountOverBudget = formatAmount({ amount: derived.amount_over_budget, currency });
  const categoryName = category.toLowerCase();

  let explanation;
  let suggestion;

  if (!time.is_current_month) {
    explanation = `Your ${budget.month} ${categoryName} budget was ${budgetAmount}. You spent ${spent}, which was ${derived.percent_budget_used}% of the budget and ${amountOverBudget} over the planned amount.`;
    suggestion = `Review the ${categoryName} purchases from ${budget.month} and adjust the next budget period if the current amount no longer reflects your needs.`;
  } else if (derived.compliance_status === "EXCEEDED") {
    explanation = `Your ${categoryName} budget for ${budget.month} is ${budgetAmount}, and you have spent ${spent}, or ${derived.percent_budget_used}% of the budget. You are ${amountOverBudget} over budget with ${time.days_remaining} days remaining, so further ${categoryName} spending increases the amount beyond the plan.`;
    suggestion = `Before another ${categoryName} purchase, review the spending that caused the excess and prioritize necessary expenses for the rest of the month.`;
  } else {
    explanation = `You have spent ${spent} of your ${budgetAmount} ${categoryName} budget, or ${derived.percent_budget_used}%, leaving ${remainingBudget} for ${time.days_remaining} days. That remaining amount now has to cover ${categoryName} expenses for the rest of the month.`;
    suggestion = `Before another ${categoryName} purchase, check the remaining ${remainingBudget} and prioritize necessary expenses so it can cover as much of the month as possible.`;
  }

  return buildBudgetInsight({
    category,
    month: budget.month,
    year: budget.year,
    riskLevel: derived.risk_level,
    explanation,
    suggestion,
  });
};

const buildBudgetInsight = ({ category, month, year, riskLevel, explanation, suggestion }) => ({
  id: `budget_${Math.random().toString(36).slice(2)}`,
  type: "budget-compliance",
  actionType: "suggestion",
  severity: riskLevel,
  category,
  month,
  year,
  agent: { explanation, suggestion },
});
