import { useLocation } from "react-router-dom";
import { FiLogOut, FiSidebar } from "react-icons/fi";
import Button from "../ui/Button";
import Tooltip from "../ui/Tooltip";
import useAuthStore from "../../store/useAuthStore";
import { useMainContext } from "../../context/MainContext";

const pageTitles = {
  "/admin": "Overview",
  "/admin/intelligence": "Intelligence",
  "/admin/data-operations": "Data Operations",
  "/admin/customer-activity": "Customer Activity",
  "/admin/investigation": "Investigation",
};

const AdminHeader = ({ onMenuOpen }) => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.currentUser);
  const userName = useAuthStore((state) => state.userName);
  const { handleSignoutPromptOpen } = useMainContext();

  return (
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Tooltip content="Open admin navigation" side="bottom">
          <Button
            variant="outline"
            className="size-10 min-h-10 shrink-0 p-0! lg:hidden"
            onClick={onMenuOpen}
            aria-label="Open admin navigation"
          >
            <FiSidebar size={18} aria-hidden="true" />
          </Button>
        </Tooltip>

        <div className="min-w-0">
          <p className="hidden text-xs text-muted-foreground sm:block">Vydra Admin</p>
          <h1 className="truncate font-display text-base font-semibold">
            {pageTitles[pathname] || "Admin Dashboard"}
          </h1>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="hidden min-w-0 text-right sm:block">
          <p className="truncate text-sm font-medium">{userName?.fullName || "Admin"}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <Tooltip content="Log out" side="bottom">
          <Button
            variant="outline"
            className="size-10 min-h-10 shrink-0 p-0!"
            onClick={handleSignoutPromptOpen}
            aria-label="Log out"
          >
            <FiLogOut size={17} aria-hidden="true" />
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};

export default AdminHeader;
