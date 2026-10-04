import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiPlus, FiCompass } from "react-icons/fi";
import SummaryCards from "../components/overview/SummayCards";
import Charts from "../components/overview/Charts";
import SmartInsight from "../components/overview/SmartInsight";
import BudgetOverview from "../components/overview/BudgetOverview";
import QuickActions from "../components/overview/QuickActions";
import ScrollToTop from "../layout/ScrollToTop";
import OverviewSkeleton from "../components/skeletons/overview/OverviewSkeleton";
import useAuthStore from "../store/useAuthStore";
import useOnboardingStore from "../store/useOnboardingStore";
import { useModalContext } from "../context/ModalContext";
import { showDemoReadOnlyToast, useDemoMode } from "../demo/useDemoMode";
import Button from "../components/ui/Button";

const Overview = () => {
  const user = useAuthStore((state) => state.currentUser);
  const userName = useAuthStore((state) => state.userName);
  const setCurrentPage = useOnboardingStore((state) => state.setCurrentPage);
  const enableTourForUser = useOnboardingStore(state => state.enableTourForUser);
  const startTour = useOnboardingStore((state) => state.startTour);
  const { onOpenModal } = useModalContext();
  const isDemoMode = useDemoMode();
  const reducedMotion = useReducedMotion();
  
  useEffect(() => {
    setCurrentPage("overview");
  }, [setCurrentPage]);
  
  if (!user) return <OverviewSkeleton />;
  
  const startOverviewTour = () => {
    enableTourForUser(user.uid);
    startTour("overview", user.uid);
  };
  
  return (
    <motion.div
      initial={ reducedMotion ? false : { opacity: 0, y: 12 } }
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="mx-auto min-w-0 w-full max-w-[90rem] space-y-8 px-4 py-8 sm:px-6"
    >
      <ScrollToTop />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>

          <h1 className="mt-1 break-words font-display text-3xl font-semibold leading-tight">
            Welcome,{" "}
            <span className="text-primary">{userName?.fullName || "User"}</span>
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Here is a summary of your financial activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {!isDemoMode && (
            <Button variant="outline" onClick={startOverviewTour}>
              <span className="flex items-center gap-2">
                <FiCompass aria-hidden="true" />
                Product tour
              </span>
            </Button>
          )}

          <Button
            onClick={() =>
              isDemoMode
                ? showDemoReadOnlyToast()
                : onOpenModal("transactions", "add")
            }
            aria-haspopup="dialog"
          >
            <span className="flex items-center gap-2">
              <FiPlus aria-hidden="true" />
              Add Entry
            </span>
          </Button>
        </div>
      </header>

      <section
        id="financial-summary"
        aria-label="Financial summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 min-[1280px]:grid-cols-4"
      >
        <SummaryCards />
      </section>

      <section id="financial-overview" aria-label="Financial Overview">
        <Charts />
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] min-[1280px]:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <section id="smart-insights" className="min-w-0 border border-border rounded-lg p-4">
          <SmartInsight />
        </section>

        <section id="budget-overview" className="border border-border rounded-lg p-4">
          <BudgetOverview />
        </section>
      </div>

      <section id="quick-actions" className="border border-border rounded-lg p-4">
        <QuickActions />
      </section>
    </motion.div>
  );
};

export default Overview;
