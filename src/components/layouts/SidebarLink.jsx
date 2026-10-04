import clsx from "clsx";
import { NavLink } from "react-router-dom";
import Tooltip from "../ui/Tooltip";

const SidebarLink = ({ to, label, icon: Icon, collapsed, onClick }) => (
  <Tooltip content={label} side="right" disabled={!collapsed}>
    <NavLink
      to={to}
      end={to === "/" || to === "/dashboard" || to === "/demo"}
      onClick={onClick}
      aria-label={label}
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
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  </Tooltip>
);

export default SidebarLink;
