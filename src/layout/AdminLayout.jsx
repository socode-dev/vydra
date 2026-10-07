import { useState } from "react";
import clsx from "clsx";
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import SignoutPrompt from "../components/modals/SignoutPrompt";

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="fixed inset-0 flex min-w-0 overflow-hidden bg-background font-sans text-foreground">
      <div
        id="admin-sidebar"
        className={clsx(
          "hidden h-full shrink-0 transition-[width] duration-200 lg:block",
          sidebarCollapsed ? "w-18" : "w-72",
        )}
      >
        <AdminSidebar collapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(value => !value)} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/45"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin navigation"
          />
          
          <div className="relative h-full w-72 max-w-[calc(100vw-2rem)]">
            <AdminSidebar mobile collapsed={false} onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader onMenuOpen={() => setMobileOpen(true)} />

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>

      <SignoutPrompt />
    </div>
  );
};

export default AdminLayout;
