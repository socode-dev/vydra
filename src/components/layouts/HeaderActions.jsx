import Button from "../ui/Button";
import { getCustomerPath, getDemoPath, useDemoMode } from "../../demo/useDemoMode";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";
import { useMainContext } from "../../context/MainContext";
import { FiBell, FiSettings } from "react-icons/fi";
import SettingsDropdown from "./SettingsDropdown";
import clsx from "clsx";
import ProfileDropdown from "./ProfileDropdown";
import Tooltip from "../ui/Tooltip";

export default function HeaderActions() {
  const navigate = useNavigate();
  const isDemoMode = useDemoMode();
  const userName = useAuthStore((state) => state.userName);
  const notifications = useNotificationStore((state) => state.notifications);
  const unread = notifications?.filter((notification) => !notification?.read).length || 0;

  const {
    settingsRef,
    profileRef,
    isSettingsOpen,
    handleSettingsToggle,
    isProfileOpen,
    handleProfileToggle,
  } = useMainContext();

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Tooltip content="Notifications" side="bottom">
        <Button
          id="notifications"
          variant="outline"
          className="relative size-11 min-h-11 shrink-0 p-0!"
          onClick={() =>
            navigate(
              isDemoMode ? getDemoPath("/notifications") : getCustomerPath("/notifications"),
            )
          }
          aria-label={`Notifications (${unread} unread)`}
        >
          <FiBell size={18} aria-hidden="true" />
          {unread > 0 && (
            <span
              aria-hidden="true"
              className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-danger px-1 text-[10px] leading-none font-semibold text-danger-foreground"
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </Tooltip>
      <div
        className="relative"
        ref={settingsRef}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isSettingsOpen) {
            handleSettingsToggle();
            settingsRef.current?.querySelector("button")?.focus();
          }
        }}
      >
        <Tooltip content="Settings" side="bottom">
          <Button
            id="settings"
            variant="outline"
            className="size-11 min-h-11 shrink-0 p-0!"
            onClick={handleSettingsToggle}
            aria-expanded={isSettingsOpen}
            aria-label="Settings"
            aria-controls="settings-menu"
          >
            <FiSettings size={18} aria-hidden="true" />
          </Button>
        </Tooltip>
        <SettingsDropdown />
      </div>
      <div
        className="relative"
        ref={profileRef}
        onKeyDown={(event) => {
          if (event.key === "Escape" && isProfileOpen) {
            handleProfileToggle();
            profileRef.current?.querySelector("button")?.focus();
          }
        }}
      >
        <Tooltip content={userName?.fullName || "Account"} side="bottom">
          <button
            type="button"
            onClick={handleProfileToggle}
            aria-expanded={isProfileOpen}
            aria-controls="profile-menu"
            aria-label="Account menu"
            className={clsx(
              "inline-flex shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold",
              "size-10 cursor-pointer text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2",
              "focus-visible:outline-ring",
            )}
          >
            {userName?.initials || "SB"}
          </button>
        </Tooltip>
        <ProfileDropdown />
      </div>
    </div>
  );
}
