import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCompass, FiHome } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import AuthLoadingScreen from "../components/ui/AuthLoadingScreen";
import { isDemoUser } from "../demo/useDemoMode";
import BrandMark from "../components/ui/BrandMark";
import Button from "../components/ui/Button";

const ErrorPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.currentUser);
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <AuthLoadingScreen />;
  }

  const isAuthenticated = Boolean(user && !isDemoUser(user));
  const destination = isAuthenticated ? "/dashboard" : "/";
  const buttonLabel = isAuthenticated ? "Go to dashboard" : "Go home";
  const Icon = isAuthenticated ? FiCompass : FiHome;

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex min-h-full w-full items-center justify-center bg-background px-4 py-10 text-foreground sm:px-6"
    >
      <section className="w-full max-w-[680px] overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-surface px-5 py-4 sm:px-6">
          <BrandMark />
          <span className="rounded-full border border-primary/20 bg-info-soft px-3 py-1 text-xs font-semibold text-primary">
            404
          </span>
        </div>

        <div className="px-5 py-8 text-center sm:px-8 sm:py-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-xs">
            <Icon size={24} aria-hidden="true" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase text-muted-foreground">
            Page not found
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground sm:text-4xl">
            This page is not available
          </h1>
          <p className="mx-auto mt-3 max-w-[460px] text-sm leading-relaxed text-muted-foreground sm:text-base">
            The page may have been moved, deleted, or opened from an outdated
            link.
          </p>

          <div className="mt-8 flex justify-center">
            <Button onClick={() => navigate(destination)}>
              <span className="flex items-center justify-center gap-2">
                {buttonLabel}
                <FiArrowRight aria-hidden="true" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default ErrorPage;
