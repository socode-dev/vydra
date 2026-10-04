import SettingsExportOptions from "./SettingsExportOptions";
import clsx from "clsx";
import useThemeStore from "../../store/useThemeStore";
import useCurrencyStore from "../../store/useCurrencyStore";
import {
  FiSun,
  FiMoon,
  FiChevronDown,
  FiDownload,
  FiSliders,
} from "react-icons/fi";
import CurrencyFlag from "react-currency-flags";
import { useMainContext } from "../../context/MainContext";
import CurrencyDropdown from "./CurrencyDropdown";
import { useOverviewContext } from "../../context/OverviewContext";
import {
  getDemoPath,
  getCustomerPath,
  showDemoReadOnlyToast,
  useDemoMode,
} from "../../demo/useDemoMode";
import { useNavigate } from "react-router-dom";

const SettingsDropdown = () => {
  const isDemoMode = useDemoMode();
  const navigate = useNavigate();
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const { handleCSVExport, handlePDFExport } = useOverviewContext();
  const {
    isSettingsOpen,
    isCurrencyOpen,
    handleCurrencyToggle,
    handleSettingsToggle,
    isExportOpen,
    setIsExportOpen,
    handleExportToggle,
  } = useMainContext();

  if (!isSettingsOpen) return null;

  const exportData = (format) => {
    if (isDemoMode) {
      showDemoReadOnlyToast();
    } else if (format === "csv") {
      handleCSVExport();
    } else {
      handlePDFExport();
    }
    setIsExportOpen(false);
  };

  return (
    <section
      id="settings-menu"
      aria-label="Settings"
      className={clsx(
        "absolute top-[calc(100%+0.5rem)] right-0 max-h-[calc(100dvh-5rem)] w-64 max-w-[calc(100vw-5rem)] overflow-y-auto",
        "rounded-lg border border-border bg-popover text-sm shadow-xl",
      )}
    >
      <h2 className="border-b border-border px-4 py-3 text-sm font-semibold">
        Settings
      </h2>
      <div className="p-2">
        <div
          className={clsx(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left [&:is(button)]:cursor-pointer",
            "[&:is(button)]:hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <FiMoon aria-hidden="true" />
            ) : (
              <FiSun aria-hidden="true" />
            )}{" "}
            Dark theme
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={theme === "dark"}
            aria-label="Dark theme"
            onClick={toggleTheme}
            className={clsx(
              "inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-border p-0.5 aria-checked:bg-primary",
              "[&>span]:size-5 [&>span]:rounded-full [&>span]:bg-white [&>span]:shadow-sm [&>span]:transition-transform",
              "aria-checked:[&>span]:translate-x-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            )}
          >
            <span />
          </button>
        </div>
        <button
          type="button"
          aria-expanded={isCurrencyOpen}
          aria-controls="currency-options"
          onClick={handleCurrencyToggle}
          className={clsx(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left [&:is(button)]:cursor-pointer",
            "[&:is(button)]:hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <span>Currency</span>
          <span className="flex items-center gap-2 text-xs">
            <CurrencyFlag currency={selectedCurrency} size="sm" />{" "}
            {selectedCurrency}
            <FiChevronDown aria-hidden="true" />
          </span>
        </button>
        <CurrencyDropdown />
        <button
          type="button"
          onClick={() => {
            handleSettingsToggle();
            navigate(isDemoMode ? getDemoPath("/settings") : getCustomerPath("/settings"));
          }}
          className={clsx(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left [&:is(button)]:cursor-pointer",
            "[&:is(button)]:hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <span className="flex items-center gap-2">
            <FiSliders aria-hidden="true" />
            Preferences
          </span>
        </button>
        <button
          type="button"
          onClick={handleExportToggle}
          aria-expanded={isExportOpen}
          aria-controls="settings-export-options"
          className={clsx(
            "flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left [&:is(button)]:cursor-pointer",
            "[&:is(button)]:hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          )}
        >
          <span className="flex items-center gap-2">
            <FiDownload aria-hidden="true" />
            Export All Data
          </span>
          <FiChevronDown aria-hidden="true" />
        </button>
        {isExportOpen && <SettingsExportOptions exportData={exportData} />}
      </div>
    </section>
  );
};

export default SettingsDropdown;
