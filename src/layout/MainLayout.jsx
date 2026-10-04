import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/layouts/Header";
import Sidebar from "../components/layouts/Sidebar";
import SignoutPrompt from "../components/modals/SignoutPrompt";
import FormModal from "../components/modals/FormModal";
import NotificationDialog from "../components/modals/NotificationDialog";
import Preferences from "../components/modals/Preferences";
import WelcomeModal from "../components/modals/WelcomeModal";
import TourJoyride from "../components/ui/TourJoyride";
import DemoBadge from "../demo/DemoBadge";
import { useDemoMode } from "../demo/useDemoMode";
import AccountVerificationBanner from "../components/layouts/AccountVerificationBanner";
import VydraToaster from "../components/ui/VydraToaster";

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isDemoMode = useDemoMode();

  return (
    <div className="relative flex h-dvh min-w-0 overflow-hidden bg-background font-sans text-foreground tracking-normal">
      <VydraToaster />

      <WelcomeModal />
      {!isDemoMode && <TourJoyride />}
      {isDemoMode && <DemoBadge />}

      {/* Sign out confirmation dialog */}
      <SignoutPrompt />

      {/* Form Modal */}
      <FormModal />

      {/* Notification dialog */}
      <NotificationDialog />

      {/* Preferences dialog */}
      <Preferences />

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((value) => !value)} />

      {/* Main Content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Header />

        <main
          id="main-content"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto scrollbar-thin"
        >
          <AccountVerificationBanner />

          {/* Outlet for nested routes */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
