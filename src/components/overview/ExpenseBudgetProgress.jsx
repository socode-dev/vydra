import ExpenseBudgetRow from "./ExpenseBudgetRow";
import clsx from "clsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCreditCard } from "react-icons/fi";
import useTransactionStore from "../../store/useTransactionStore";
import useCurrencyStore from "../../store/useCurrencyStore";
import useThresholdStore from "../../store/useThresholdStore";
import { getAmountSpent } from "../../utils/getAmountSpent";
import { getCustomerPath, getDemoPath, useDemoMode } from "../../demo/useDemoMode";
import Button from "../ui/Button";

const ExpenseBudgetProgress = () => {
  const budgets = useTransactionStore((state) => state.budgets);
  const transactions = useTransactionStore((state) => state.transactions);
  const currency = useCurrencyStore((state) => state.selectedCurrency);
  const warningThreshold = useThresholdStore( state => state.thresholds?.budgetThreshold80 ?? 80);
  const isDemoMode = useDemoMode();
  const budgetsPath = isDemoMode ? getDemoPath("/budgets") : getCustomerPath("/budgets");

  const expenseBudgets = useMemo(
    () =>
      budgets
        .filter((budget) => budget.type === "expense")
        .sort(
          (a, b) =>
            (new Date(b.date).getTime() || 0) -
            (new Date(a.date).getTime() || 0),
        ),
    [budgets],
  );

  const rows = useMemo(
    () =>
      expenseBudgets.slice(0, 5).map((budget) => ({
        ...budget,
        spent: getAmountSpent(
          budget.categoryKey,
          budget.date,
          "expense",
          transactions,
        ),
      })),
    [expenseBudgets, transactions],
  );

  return (
    <section
      aria-labelledby="expense-budget-progress-title"
      className="min-w-0 rounded-xl border border-border bg-card p-5"
    >
      <header className="mb-6 flex min-h-12 flex-wrap items-start justify-between gap-3 border-b border-border pb-4">
        <div className="min-w-0">
          <h3
            id="expense-budget-progress-title"
            className="font-display text-base font-semibold"
          >
            Budget Overview
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Expense budgets by category and month
          </p>
        </div>
        <Button
          as={Link}
          to={budgetsPath}
          variant="ghost"
          className="shrink-0 px-2"
        >
          Manage
        </Button>
      </header>
      {rows.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-4 p-4 text-center text-muted-foreground">
          <FiCreditCard size={28} aria-hidden="true" />
          <p className="text-sm font-medium text-foreground">
            No expense budgets set
          </p>
          <Button as={Link} to={budgetsPath} variant="outline">
            Set a budget
          </Button>
        </div>
      ) : (
        <ul className="space-y-5">
          {rows.map((budget) => (
            <ExpenseBudgetRow
              key={budget.id}
              budget={budget}
              currency={currency}
              warningThreshold={warningThreshold}
            />
          ))}
        </ul>
      )}
      {expenseBudgets.length > 5 && (
        <Link
          to={budgetsPath}
          className={clsx(
            "font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-ring mt-5 inline-flex items-center gap-2 text-xs",
          )}
        >
          View all {expenseBudgets.length} expense budgets{" "}
          <FiArrowRight aria-hidden="true" />
        </Link>
      )}
    </section>
  );
};

export default ExpenseBudgetProgress;
