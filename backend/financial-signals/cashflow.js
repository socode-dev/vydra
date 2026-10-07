import { getDaysInMonth, getDate, getMonth, getYear } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const buildCashflowData = ({ transactions, currency }) => {
  const now = new Date();

  const currentMonth = getMonth(now) + 1;
  const currentYear = getYear(now);

  const todayDate = getDate(now);
  const totalDaysInMonth = getDaysInMonth(now);
  const daysRemaining = totalDaysInMonth - todayDate;

  const percentOfMonthElapsed = Math.round(
      (todayDate / totalDaysInMonth) * 100
  );

  const currentMonthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
          getMonth(transactionDate) + 1 === currentMonth &&
          getYear(transactionDate) === currentYear
      );
  });

  const totalIncome = totalAmount(currentMonthTransactions, "income");
  const totalSpent = totalAmount(currentMonthTransactions, "expense");

  const netCashflow = parseFloat(
      (totalIncome - totalSpent).toFixed(2)
  );

  const percentSpent =
      totalIncome > 0
          ? Math.round((totalSpent / totalIncome) * 100)
          : 0;

  const hasNoIncome = totalIncome === 0;

  const getOutcome = () => {
    if (hasNoIncome) {
      if (totalSpent > 0) {
          return "RISK";
      }

      return "SAFE";
    }

    const currentRatio = totalSpent / totalIncome;

    if (currentRatio >= 1) {
      return "RISK";
    }

    if (
      currentRatio >= 0.4 &&
      percentSpent > percentOfMonthElapsed * 2
    ) {
      return "WARNING";
    }

    return "SAFE";
  };

    const outcome = getOutcome();

    if (outcome === "SAFE") return null;

    return {
        id: `txn_${uuidv4()}`,

        period: {
            days_elapsed: todayDate,
            days_remaining: daysRemaining,
            percent_elapsed: percentOfMonthElapsed,
            month: new Intl.DateTimeFormat("en-US", {
                month: "short",
            }).format(now),
            year: new Intl.DateTimeFormat("en-US", {
                year: "numeric",
            }).format(now),
        },

        income: {
            total: parseFloat(totalIncome.toFixed(2)),
            currency,
        },

        spending: {
            total_spent: parseFloat(totalSpent.toFixed(2)),
        },

        derived: {
            net_cashflow: netCashflow,
            percent_spent: percentSpent,
            has_no_income: hasNoIncome,
        },

        outcome,
    };
};

const totalAmount = (transactions, type) => {
    return transactions
        .filter((t) => t.type === type)
        .reduce(
            (sum, t) =>
                sum + (typeof t.amount === "number" ? t.amount : 0),
            0
        );
};