import { CURRENCY_LOCALES } from "../../shared/currencyLocales.js";

export const formatPdfAmount = (amount, currency) => {
  const safeAmount = amount ?? 0;

  const locale = CURRENCY_LOCALES[currency] ?? "en-US";

  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "code",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(safeAmount)
    .replace(/\u00a0/g, " ");
}
