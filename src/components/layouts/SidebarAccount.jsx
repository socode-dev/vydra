import clsx from "clsx";
import { FiLogOut, FiSettings, FiShield } from "react-icons/fi";
import useAuthStore from "../../store/useAuthStore";
import { getCustomerPath, getDemoPath, useDemoMode } from "../../demo/useDemoMode";
import { useMainContext } from "../../context/MainContext";
import SidebarLink from "./SidebarLink";
import Tooltip from "../ui/Tooltip";
import useAdminAccess from "../../hooks/useAdminAccess";

const SidebarAccount = ({ collapsed, onNavigate }) => {
  const user = useAuthStore((state) => state.currentUser);
  const userName = useAuthStore((state) => state.userName);
  const demo = useDemoMode();
  const isAdmin = useAdminAccess();
  const { handleSignoutPromptOpen } = useMainContext();
  const logout = () => {
    onNavigate();
    handleSignoutPromptOpen();
  };

  return (
    <div
      className={clsx(
        "shrink-0 border-t border-sidebar-border py-3",
        collapsed ? "px-2" : "px-3",
      )}
    >
      <SidebarLink
        to={demo ? getDemoPath("/settings") : getCustomerPath("/settings")}
        label="Settings"
        icon={FiSettings}
        collapsed={collapsed}
        onClick={onNavigate}
      />
      {!demo && isAdmin && (
        <SidebarLink
          to="/admin"
          label="Admin Dashboard"
          icon={FiShield}
          collapsed={collapsed}
          onClick={onNavigate}
        />
      )}
      <div
        className={clsx(
          "mt-2",
          !collapsed &&
            "overflow-hidden rounded-lg border border-sidebar-border bg-card",
        )}
      >
        <div
          className={clsx(
            "flex min-w-0 items-center gap-2.5 py-2.5",
            collapsed ? "justify-center" : "px-3",
          )}
        >
          <Tooltip
            content={userName?.fullName || "Your account"}
            side="right"
            disabled={!collapsed}
          >
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              tabIndex={collapsed ? 0 : undefined}
            >
              {userName?.initials || "SB"}
            </span>
          </Tooltip>
          {!collapsed && (
            <div className="min-w-0">
              <p
                className="truncate text-sm font-medium"
                title={userName?.fullName}
              >
                {userName?.fullName || "Your account"}
              </p>
              <p
                className="truncate text-xs text-muted-foreground"
                title={user?.email}
              >
                {user?.email}
              </p>
            </div>
          )}
        </div>
        <Tooltip
          content={demo ? "Exit Demo" : "Log Out"}
          side="right"
          disabled={!collapsed}
        >
          <button
            type="button"
            onClick={logout}
            aria-haspopup="dialog"
            aria-label={demo ? "Exit Demo" : "Log Out"}
            className={clsx(
              "flex min-h-10 w-full cursor-pointer items-center gap-2 py-2 text-sm font-medium text-danger hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-ring",
              collapsed
                ? "justify-center rounded-lg"
                : "border-t border-sidebar-border px-3",
            )}
          >
            <FiLogOut className="size-4 shrink-0" aria-hidden="true" />
            {!collapsed && <span>{demo ? "Exit Demo" : "Log Out"}</span>}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default SidebarAccount;
