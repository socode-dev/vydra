import { DEMO_CURRENCY, DEMO_CURRENCY_SYMBOL, getDemoReferenceDate } from "../demoConfig";

const pad = (value) => String(value).padStart(2, "0");

const toDateKey = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const atTime = (date, hour = 9) => {
  const value = new Date(date);
  value.setHours(hour, 0, 0, 0);
  return value.getTime();
};

const expiresAfterTtl = (createdAt) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 7);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
};

const monthStart = (referenceDate, offset = 0) => {
  const date = new Date(referenceDate);
  return new Date(date.getFullYear(), date.getMonth() + offset, 1, 9, 0, 0, 0);
};

const monthDate = (referenceDate, offset, day) => {
  const date = monthStart(referenceDate, offset);
  const isCurrentMonth = offset === 0;
  date.setDate(isCurrentMonth ? Math.min(day, new Date(referenceDate).getDate()) : day);
  return date;
};

const monthLabel = (date) =>
  new Intl.DateTimeFormat("en-NG", { month: "long" }).format(date);

const formatDemoAmount = (amount) =>
  `${DEMO_CURRENCY_SYMBOL}${Number(amount).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const sum = (items) => items.reduce((total, item) => total + Number(item.amount), 0);

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const expenseDefinitions = [
  ["Food", "food", "Market and household groceries", 5],
  ["Transportation", "transportation", "Work commute and business travel", 8],
  ["Utilities", "utilities", "Power, water, and prepaid services", 10],
  ["Rent", "rent", "Monthly rent payment", 2],
  ["Healthcare", "healthcare", "Clinic and medication expenses", 14],
  ["Shopping", "shopping", "Household and business replacement purchases", 18],
  ["Entertainment", "entertainment", "Family events and subscriptions", 22],
];

const monthlyPatterns = [
  { income: 420000, food: 70000, transportation: 35000, utilities: 28000, rent: 120000, healthcare: 18000, shopping: 25000, entertainment: 18000 },
  { income: 420000, food: 72000, transportation: 36000, utilities: 30000, rent: 120000, healthcare: 22000, shopping: 30000, entertainment: 20000 },
  { income: 450000, bonus: 75000, food: 75000, transportation: 34000, utilities: 27000, rent: 120000, healthcare: 20000, shopping: 28000, entertainment: 22000 },
  { income: 430000, food: 80000, transportation: 38000, utilities: 31000, rent: 120000, healthcare: 24000, shopping: 45000, entertainment: 25000 },
  { income: 420000, food: 85000, transportation: 40000, utilities: 33000, rent: 120000, healthcare: 25000, shopping: 38000, entertainment: 28000 },
  { income: 450000, food: 202007.3, transportation: 42000, utilities: 35000, rent: 120000, healthcare: 26000, shopping: 42000, entertainment: 28000 },
];

const makeTransaction = ({ id, name, description, category, categoryKey, type, amount, date }) => ({
  id,
  name,
  description,
  category,
  categoryKey,
  type,
  amount,
  date: toDateKey(date),
  createdAt: atTime(date),
});

const buildTransactions = (referenceDate) =>
  monthlyPatterns.flatMap((pattern, index) => {
    const offset = index - (monthlyPatterns.length - 1);
    const start = monthStart(referenceDate, offset);
    const monthKey = `${start.getFullYear()}-${pad(start.getMonth() + 1)}`;
    const transactions = [
      makeTransaction({
        id: `demo-income-${monthKey}`,
        name: "Cooperative Disbursement",
        description: "Monthly cooperative income",
        category: "Salary",
        categoryKey: "txn:salary",
        type: "income",
        amount: pattern.income,
        date: start,
      }),
      ...expenseDefinitions.map(([category, key, description, day]) =>
        makeTransaction({
          id: `demo-${key}-${monthKey}`,
          name: category,
          description,
          category,
          categoryKey: `txn:${key}`,
          type: "expense",
          amount: pattern[key],
          date: monthDate(referenceDate, offset, day),
        }),
      ),
    ];

    if (pattern.bonus) {
      transactions.splice(1, 0, makeTransaction({
        id: `demo-income-bonus-${monthKey}`,
        name: "Market Stall Bonus",
        description: "Quarterly trading bonus",
        category: "Freelance",
        categoryKey: "txn:freelance",
        type: "income",
        amount: pattern.bonus,
        date: monthDate(referenceDate, offset, 27),
      }));
    }

    return transactions;
  });

const buildBudgets = (referenceDate) => {
  const date = monthStart(referenceDate);
  const definitions = [
    ["Monthly Income", "Salary", "txn:salary", "income", 600000],
    ["Food", "Food", "txn:food", "expense", 250000],
    ["Transportation", "Transportation", "txn:transportation", "expense", 160000],
    ["Utilities", "Utilities", "txn:utilities", "expense", 140000],
    ["Rent", "Rent", "txn:rent", "expense", 500000],
    ["Healthcare", "Healthcare", "txn:healthcare", "expense", 100000],
    ["Shopping", "Shopping", "txn:shopping", "expense", 50000],
    ["Entertainment", "Entertainment", "txn:entertainment", "expense", 110000],
  ];

  return definitions.map(([name, category, categoryKey, type, amount], index) => ({
    id: `demo-budget-${categoryKey.replace("txn:", "")}`,
    name,
    category,
    categoryKey,
    type,
    amount,
    date: toDateKey(date),
    createdAt: atTime(date, 8 + index),
  }));
};

const buildGoals = (referenceDate) => {
  const definitions = [
    ["Emergency Liquidity Buffer", "goal:emergency-liquidity-buffer", 1500000, 6, 2],
    ["Shop Inventory Restock", "goal:shop-inventory-restock", 900000, 4, 3],
    ["School Fees Reserve", "goal:school-fees-reserve", 600000, 3, 4],
  ];

  return definitions.map(([name, categoryKey, amount, dueOffset, createdOffset]) => {
    const dueDate = monthDate(referenceDate, dueOffset, 15);
    const createdAt = monthDate(referenceDate, -createdOffset, 7);

    return {
      id: `demo-${categoryKey}`,
      name,
      categoryKey,
      amount,
      date: toDateKey(dueDate),
      createdAt: atTime(createdAt, 10),
    };
  });
};

const buildContributions = (referenceDate) => {
  const definitions = [
    ["emergency-liquidity-buffer", 180000, -5, 25],
    ["emergency-liquidity-buffer", 220000, -3, 25],
    ["emergency-liquidity-buffer", 250000, -1, 25],
    ["shop-inventory-restock", 180000, -4, 20],
    ["shop-inventory-restock", 220000, -2, 20],
    ["school-fees-reserve", 150000, -3, 18],
    ["school-fees-reserve", 175000, -1, 18],
  ];

  return definitions.map(([key, amount, offset, day], index) => {
    const date = monthDate(referenceDate, offset, day);
    const name = key.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");

    return {
      id: `demo-contribution-${key}-${index}`,
      name,
      categoryKey: `goal:${key}`,
      amount,
      date: toDateKey(date),
      createdAt: atTime(date, 11),
    };
  });
};

const buildInsights = (referenceDate, transactions, budgets) => {
  const latest = monthStart(referenceDate);
  const latestMonth = toDateKey(latest).slice(0, 7);
  const foodTransactions = transactions.filter((transaction) => transaction.categoryKey === "txn:food");
  const currentFood = sum(foodTransactions.filter((transaction) => transaction.date.startsWith(latestMonth)));
  const historicalFood = [...new Set(foodTransactions.map((transaction) => transaction.date.slice(0, 7)))]
    .filter((month) => month !== latestMonth)
    .sort()
    .slice(-5)
    .map((month) => sum(foodTransactions.filter((transaction) => transaction.date.startsWith(month))));
  const foodBaseline = median(historicalFood);
  const foodDeviation = Math.round(((currentFood - foodBaseline) / foodBaseline) * 100);
  const foodBudget = budgets.find((budget) => budget.categoryKey === "txn:food");
  const weeklyFoodBudget = foodBaseline / 4;
  const currentIncome = sum(transactions.filter((transaction) => transaction.type === "income" && transaction.date.startsWith(latestMonth)));
  const currentSpending = sum(transactions.filter((transaction) => transaction.type === "expense" && transaction.date.startsWith(latestMonth)));
  const amountOverIncome = Math.max(currentSpending - currentIncome, 0);
  const daysRemaining = new Date(latest.getFullYear(), latest.getMonth() + 1, 0).getDate() - referenceDate.getDate();
  const spendingPercent = Math.round((currentSpending / currentIncome) * 100);
  const budgetStatus = currentFood >= foodBudget.amount ? "EXCEEDED" : "ON_TRACK";
  const cashflowOutcome = spendingPercent >= 85 ? "WARNING" : "SAFE";
  const created = (day) => atTime(monthDate(referenceDate, 0, day));
  const active = [
    {
      id: "demo-insight-anomaly-food",
      type: "anomaly",
      status: "ACTIVE",
      severity: "MEDIUM",
      category: "Food",
      currency: DEMO_CURRENCY,
      signal: {
        source: "deterministic-demo-fixture",
        metric: "category_spending",
        currentValue: currentFood,
        baselineValue: foodBaseline,
        deviationPercent: foodDeviation,
      },
      year: latest.getFullYear(),
      createdAt: created(6),
      expiresAt: expiresAfterTtl(created(6)),
      agent: {
        explanation: `Your food spending in October was ${formatDemoAmount(currentFood)}, which is a huge jump from your usual ${formatDemoAmount(foodBaseline)} and the highest in recent months. This level of spending will definitely affect your overall budget.`,
        suggestion: `Set a strict budget of ${formatDemoAmount(weeklyFoodBudget)} weekly for food in November to keep your total around ${formatDemoAmount(foodBaseline)} for the month.`,
      },
      modelUsed: "Demo Rule Engine",
    },
    {
      id: "demo-insight-budget-food",
      type: "budget-compliance",
      status: "ACTIVE",
      severity: "HIGH",
      category: "Food",
      currency: DEMO_CURRENCY,
      signal: {
        source: "deterministic-demo-fixture",
        metric: "budget_compliance",
        currentValue: currentFood,
        limit: foodBudget.amount,
        percentUsed: Math.round((currentFood / foodBudget.amount) * 100),
        status: budgetStatus,
      },
      year: latest.getFullYear(),
      createdAt: created(8),
      expiresAt: expiresAfterTtl(created(8)),
      agent: {
        explanation: `You have a budget of ${formatDemoAmount(foodBudget.amount)} for food this month, and you have spent ${formatDemoAmount(currentFood)} so far, which is ${Math.round((currentFood / foodBudget.amount) * 100)}% of your budget. There are still 26 days left in the month, meaning you need to manage the remaining budget of ${formatDemoAmount(foodBudget.amount - currentFood)} carefully to cover your food expenses for the rest of the month. If you exceed your budget, it would mean spending more than planned for this category, which could leave you with less money than intended for other expenses.`,
        suggestion: `Before making any additional purchases in the food category, check your remaining budget of ${formatDemoAmount(foodBudget.amount - currentFood)} and prioritize necessary expenses to ensure it covers as much of the month as possible.`,
      },
      modelUsed: "Demo Rule Engine",
    },
    {
      id: "demo-insight-cashflow",
      type: "cashflow",
      status: "ACTIVE",
      severity: cashflowOutcome === "WARNING" ? "MEDIUM" : "LOW",
      category: null,
      currency: DEMO_CURRENCY,
      signal: {
        source: "deterministic-demo-fixture",
        metric: "cashflow",
        income: currentIncome,
        spending: currentSpending,
        percentSpent: spendingPercent,
        outcome: cashflowOutcome,
      },
      year: latest.getFullYear(),
      createdAt: created(10),
      expiresAt: expiresAfterTtl(created(10)),
      agent: {
        explanation: `Spending has exceeded recorded income by ${formatDemoAmount(amountOverIncome)} with ${daysRemaining} days remaining in the month. This means you have spent more than you have earned this month.`,
        suggestion: "Prioritize necessary expenses and limit any non-essential spending for the rest of the month.",
      },
      modelUsed: "Demo Rule Engine",
    },
  ];

  return {
    active,
    history: [
      ...active,
      {
        id: "demo-insight-budget-shopping",
        type: "budget",
        status: "EXPIRED",
        category: "Shopping",
        severity: "MEDIUM",
        createdAt: atTime(monthDate(referenceDate, -1, 20)),
        expiresAt: expiresAfterTtl(atTime(monthDate(referenceDate, -1, 20))),
        agent: {
          explanation: `${monthLabel(monthStart(referenceDate, -1))} shopping spending approached its configured limit before returning to a healthier level.`,
          suggestion: "Continue reviewing discretionary purchases against the monthly plan.",
        },
        modelUsed: "Demo Rule Engine",
      },
    ],
  };
};

export const buildDemoStory = (referenceDate = getDemoReferenceDate()) => {
  const latestDate = monthStart(referenceDate);
  const transactions = buildTransactions(referenceDate);
  const budgets = buildBudgets(referenceDate);
  const insights = buildInsights(referenceDate, transactions, budgets);

  return {
    referenceDate: toDateKey(latestDate),
    transactions,
    budgets,
    goals: buildGoals(referenceDate),
    contributions: buildContributions(referenceDate),
    insights: insights.active,
    insightsHistory: insights.history,
    notifications: [
      {
        id: "demo-notification-budget",
        subject: `${monthLabel(latestDate)} budget pressure in food`,
        message: "Food spending is above its configured limit while most other budgets remain on track.",
        type: "Budget",
        read: false,
        createdAt: atTime(monthDate(referenceDate, 0, 8), 10),
      },
      {
        id: "demo-notification-anomaly",
        subject: "A meaningful spending change was detected",
        message: "Food spending is materially higher than Amina's recent monthly pattern.",
        type: "Insight",
        read: false,
        createdAt: atTime(monthDate(referenceDate, 0, 6), 10),
      },
      {
        id: "demo-notification-history",
        subject: "Insight history available",
        message: "This demo includes active and expired records to show how Vydra preserves financial context over time.",
        type: "System",
        read: true,
        createdAt: atTime(monthDate(referenceDate, -1, 28), 10),
      },
    ],
  };
};

export const demoStory = buildDemoStory();
