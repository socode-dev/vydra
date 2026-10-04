import { NavLink } from "react-router-dom";
import { FiCreditCard, FiTarget, FiPieChart, FiX } from "react-icons/fi";
import { LuLightbulb, LuGauge, LuListTree, LuChevronsRight, LuChevronsLeft } from "react-icons/lu";
import clsx from "clsx";
import { useMainContext } from "../../context/MainContext";
import { getCustomerPath, getDemoPath, useDemoMode } from "../../demo/useDemoMode";
import Button from "../ui/Button";
import SidebarLink from "./SidebarLink";
import SidebarAccount from "./SidebarAccount";
import Tooltip from "../ui/Tooltip";
import VydraLogo from "../ui/VydraLogo";

const links = [
  { to: "/", label: "Overview", icon: LuGauge },
  { to: "/transactions", label: "Transactions", icon: LuListTree },
  { to: "/budgets", label: "Budgets", icon: FiCreditCard },
  { to: "/goals", label: "Goals", icon: FiTarget },
  { to: "/insights", label: "Insights", icon: LuLightbulb },
  { to: "/reports", label: "Reports", icon: FiPieChart },
];

const SidebarContent = ({ collapsed = false, mobile = false, onToggleSidebar }) => {
  const demo = useDemoMode();
  const { handleSidebarClose } = useMainContext();
  
  const close = () => {
    if (mobile) document.getElementById("mobile-sidebar")?.close();
    handleSidebarClose();
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-sidebar">
      <div
        className={clsx(
          "flex min-h-20 items-center gap-3 border-b border-sidebar-border py-2",
          collapsed ? "flex-col justify-center px-2" : "justify-between px-5",
        )}
      >
        <Tooltip content="Vydra" side="right" disabled={!collapsed}>
          <NavLink
            to={demo ? getDemoPath("/") : getCustomerPath("/")}
            onClick={close}
            aria-label="Vydra overview"
            className="flex min-w-0 items-center gap-0.5 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <VydraLogo variant="mark" className="size-12" label="" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold">
                  Vydra
                </p>
                <p className="text-xs text-muted-foreground">
                  Financial clarity
                </p>
              </div>
            )}
          </NavLink>
        </Tooltip>

        <Tooltip
          content={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          side={collapsed ? "right" : "bottom"}
        >
          <button
            className="w-fit mx-auto p-2 rounded-lg hover:bg-secondary cursor-pointer transition"
            onClick={onToggleSidebar}
            aria-controls="app-sidebar"
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <LuChevronsRight size={18} aria-hidden="true" /> : <LuChevronsLeft size={18} aria-hidden="true" />}
          </button>
        </Tooltip>

        {mobile && (
          <Tooltip content="Close navigation" side="bottom">
            <Button
              variant="ghost"
              className="ml-auto size-10 shrink-0 p-0!"
              onClick={close}
              aria-label="Close navigation"
            >
              <FiX aria-hidden="true" size={20} />
            </Button>
          </Tooltip>
        )}
      </div>

      <nav
        aria-label="Main navigation"
        className={clsx(
          "min-h-0 flex-1 space-y-1 overflow-y-auto py-2 scrollbar-thin",
          collapsed ? "px-2" : "px-3",
        )}
      >
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            {...link}
            to={demo ? getDemoPath(link.to) : getCustomerPath(link.to)}
            collapsed={collapsed}
            onClick={close}
          />
        ))}
      </nav>
      <SidebarAccount collapsed={collapsed} onNavigate={close} />
    </div>
  );
};
export default SidebarContent;
