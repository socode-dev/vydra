import { CURRENCY_LOCALES } from "../../../shared/currencyLocales.js"

export const formatAmount = ({amount, currency}) => {
  const safeAmount = amount ?? 0;

  const locale = CURRENCY_LOCALES[currency] ?? "en-US";

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedAmount = formattedCurrency.format(safeAmount);
  return formattedAmount;
};
