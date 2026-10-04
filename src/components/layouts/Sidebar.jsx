import { useEffect, useRef } from "react";
import clsx from "clsx";
import { useMainContext } from "../../context/MainContext";
import SidebarContent from "./SidebarContent";

const Sidebar = ({ collapsed, onToggleSidebar }) => {
  const { isSidebarOpen, handleSidebarClose } = useMainContext();
  const drawerRef = useRef(null);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (isSidebarOpen && !drawer.open) drawer.showModal();
    if (!isSidebarOpen && drawer.open) drawer.close();
  }, [isSidebarOpen]);

  return (
    <>
      <aside
        id="app-sidebar"
        className={clsx(
          "hidden shrink-0 border-r border-sidebar-border lg:block",
          collapsed ? "w-18" : "w-64",
        )}
      >
        <SidebarContent collapsed={collapsed} onToggleSidebar={onToggleSidebar} />
      </aside>

      <dialog
        ref={drawerRef}
        id="mobile-sidebar"
        aria-label="Navigation"
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-dvh w-72 max-w-[calc(100vw-2rem)] border-0 bg-sidebar p-0! font-sans text-foreground backdrop:bg-black/45"
        onCancel={handleSidebarClose}
        onClose={handleSidebarClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) handleSidebarClose();
        }}
      >
        <SidebarContent mobile />
      </dialog>
    </>
  );
};
export default Sidebar;
