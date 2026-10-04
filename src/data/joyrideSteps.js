const step = (target, content) => ({
  target,
  content,
  disableBeacon: true,
});

export const overviewSteps = [
  step(
    "#financial-summary",
    "Start with a quick view of your income, expenses, net balance, and budget usage.",
  ),
  step(
    "#financial-overview",
    "See how your income, spending, and budget activity are developing over time.",
  ),
  step(
    "#budget-overview",
    "Review your budget usage and see which categories need attention.",
  ),
  step(
    "#smart-insights",
    "Vydra surfaces financial conditions and patterns that may deserve your attention, with context to help you understand what they mean.",
  ),
  step(
    "#quick-actions",
    "Use Quick Actions when you want to add an entry, set a budget or goal, or export your financial log.",
  ),
];
