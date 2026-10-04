import { CURRENCY_LOCALES } from "../../shared/currencyLocales.js";

export const formatAmount = (amount, selectedCurrency) => {
  const safeAmount = amount ?? 0;

  const locale = CURRENCY_LOCALES[selectedCurrency] ?? "en-US";

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: selectedCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formattedCurrency.format(safeAmount);
  return formattedAmount;
};

export const compactAmount = (amount, selectedCurrency) => {
  const safeAmount = amount ?? 0;

  const locale = CURRENCY_LOCALES[selectedCurrency] ?? "en-US";

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: selectedCurrency,
    notation: "compact",
    maximumFractionDigits: 1,
  });

  const formattedAmount = formattedCurrency.format(safeAmount);
  return formattedAmount;
};