import { Link, Outlet } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ResetLink from "../components/modals/ResetLink";
import ResetSuccessful from "../components/modals/ResetSuccessful";
import BrandMark from "../components/ui/BrandMark";
import VydraToaster from "../components/ui/VydraToaster";

const AuthLayout = () => {
  return (
    <div className="grid min-h-screen bg-background font-sans text-foreground tracking-normal lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <VydraToaster />
      <ResetLink />
      <ResetSuccessful />
      
      <aside className="hidden border-r border-border bg-background p-12 lg:flex lg:flex-col lg:justify-between lg:gap-12">
        <Link to="/" aria-label="Back to Vydra home" className="inline-flex w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
          <BrandMark />
        </Link>
        
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-semibold leading-tight">
            Personal Financial Intelligence
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            understand financial flow, plan with confidence and make informed decisions.
          </p>
        </div>

        <div />
      </aside>
      <div className="flex min-w-0 flex-col bg-background px-6 py-8 lg:p-12">
        <div className="relative mb-10 flex min-h-10 items-center justify-center lg:justify-start">
          <Link
            to="/"
            aria-label="Back to Vydra home"
            title="Back to Vydra home"
            className="absolute left-0 inline-flex size-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <FiArrowLeft aria-hidden="true" size={20} />
          </Link>
          <Link
            to="/"
            aria-label="Vydra home"
            className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:hidden"
          >
            <BrandMark />
          </Link>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
export default AuthLayout;
