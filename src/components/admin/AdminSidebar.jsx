import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  FiActivity,
  FiArrowUpRight,
  FiDatabase,
  FiGrid,
  FiHome,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { LuChevronsLeft, LuChevronsRight, LuBrain } from "react-icons/lu";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import VydraLogo from "../ui/VydraLogo";
import Button from "../ui/Button";
import Tooltip from "../ui/Tooltip";

const links = [
  { to: "/admin", label: "Overview", icon: FiGrid, end: true },
  { to: "/admin/intelligence", label: "Intelligence", icon: LuBrain },
  { to: "/admin/data-operations", label: "Data Operations", icon: FiDatabase },
  { to: "/admin/customer-activity", label: "Customer Activity", icon: FiUsers },
  { to: "/admin/investigation", label: "Investigation", icon: HiOutlineDocumentSearch },
];

const AdminSidebar = ({ collapsed = false, mobile = false, onClose, onToggleSidebar }) => (
  <aside
    className={clsx(
      "flex h-full min-h-0 w-full flex-col border-r border-sidebar-border bg-sidebar",
      mobile && "shadow-xl",
    )}
  >
    <div className={clsx(
      "flex min-h-20 items-center gap-3 border-b border-sidebar-border py-2",
      collapsed ? "flex-col justify-center px-2" : "justify-between px-5",
    )}>
      <Tooltip content="Vydra Admin" side="right" disabled={!collapsed}>
        <NavLink
          to="/admin"
          onClick={onClose}
          aria-label="Vydra Admin overview"
          className="flex min-w-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-ring"
        >
          <VydraLogo variant="mark" className="size-10" label="" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold">Vydra</p>
              <p className="text-xs text-muted-foreground">Admin operations</p>
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
            className="ml-auto size-10 min-h-10 shrink-0 p-0!"
            onClick={onClose}
            aria-label="Close admin navigation"
          >
            <FiX size={19} aria-hidden="true" />
          </Button>
        </Tooltip>
      )}
    </div>

    <nav
      aria-label="Admin navigation"
      className={clsx(
        "min-h-0 flex-1 space-y-1 overflow-y-auto py-2 scrollbar-thin",
        collapsed ? "px-2" : "px-3",
      )}
    >
      {!collapsed && (
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Operations
        </p>
      )}
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onClose}
          className={({ isActive }) =>
            clsx(
              "relative flex min-h-10 items-center gap-3 rounded-lg py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              collapsed ? "justify-center px-2" : "px-3",
              isActive
                ? "bg-sidebar-accent text-primary before:absolute before:rounded-full before:bg-primary before:content-['']"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              isActive &&
                (collapsed
                  ? "before:inset-x-2 before:-bottom-0.5 before:h-0.5"
                  : "before:inset-y-2 before:left-0 before:w-0.5"),
            )
          }
        >
          <Tooltip content={label} side="right" disabled={!collapsed}>
            <Icon className="size-4 shrink-0" aria-hidden="true" />
          </Tooltip>
          {!collapsed && <span>{label}</span>}
        </NavLink>
      ))}
    </nav>

    <div className={clsx("border-t border-sidebar-border py-3", collapsed ? "px-2" : "px-3")}>
      <Tooltip content="Customer dashboard" side="right" disabled={!collapsed}>
        <NavLink
          to="/dashboard"
          end
          onClick={onClose}
          className={clsx(
            "flex min-h-10 items-center gap-3 rounded-lg py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            collapsed ? "justify-center px-2" : "px-3",
          )}
        >
          <FiHome className="size-4 shrink-0" aria-hidden="true" />
          {!collapsed && <span className="min-w-0 flex-1">Customer dashboard</span>}
          {!collapsed && <FiArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />}
        </NavLink>
      </Tooltip>
    </div>

    <div className={clsx("border-t border-sidebar-border py-4", collapsed ? "px-2" : "px-4")}>
      <Tooltip content="Telemetry-backed signals only" side="right" disabled={!collapsed}>
        <div className={clsx(
          "flex items-start gap-2 rounded-lg border border-sidebar-border bg-card py-3",
          collapsed ? "justify-center px-2" : "px-3",
        )}>
        <FiActivity className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
        {!collapsed && <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground">Operational view</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Telemetry-backed signals only
          </p>
        </div>}
      </div>
      </Tooltip>
    </div>
  </aside>
);

export default AdminSidebar;
