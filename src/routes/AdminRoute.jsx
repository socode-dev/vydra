import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { isDemoUser } from "../demo/useDemoMode";
import useAuthStore from "../store/useAuthStore";
import AuthLoadingScreen from "../components/ui/AuthLoadingScreen";
import Button from "../components/ui/Button";
import { syncAdminAccess } from "../api/adminAccess";

const AdminAccessDenied = () => (
  <main className="flex min-h-dvh items-center justify-center bg-background px-6">
    <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        Admin access required
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-foreground">
        This area is restricted
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your Vydra account does not have permission to view the Admin Dashboard.
      </p>
      <Button as={Link} to="/dashboard" className="mt-6">
        Go to dashboard
      </Button>
    </section>
  </main>
);

const AdminRoute = ({ children }) => {
  const user = useAuthStore((state) => state.currentUser);
  const authLoading = useAuthStore((state) => state.loading);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const resolveAdminAccess = async () => {
      if (authLoading) return;

      if (!user || isDemoUser(user)) {
        setStatus("signed_out");
        return;
      }

      try {
        const authUser = auth.currentUser;

        if (!authUser || authUser.uid !== user.uid) {
          if (!cancelled) setStatus("forbidden");
          return;
        }

        let tokenResult = await authUser.getIdTokenResult(true);

        if (tokenResult.claims.admin === true) {
          if (!cancelled) setStatus("allowed");
          return;
        }

        try {
          await syncAdminAccess();
          tokenResult = await authUser.getIdTokenResult(true);
        } catch (error) {
          // Frontend-only Vite runs do not expose Vercel API routes. Keep an
          // already-issued claim usable locally, but never grant access here.
          if (error?.status === 403 || tokenResult.claims.admin !== true) throw error;
        }

        if (!cancelled) {
          setStatus(tokenResult.claims.admin === true ? "allowed" : "forbidden");
        }
      } catch {
        if (!cancelled) setStatus("forbidden");
      }
    };

    resolveAdminAccess();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  if (authLoading || status === "loading") {
    return <AuthLoadingScreen message="Loading Admin Dashboard..." />;
  }
  if (status === "signed_out") return <Navigate to="/login" replace />;
  if (status === "forbidden") return <AdminAccessDenied />;

  return children;
};

export default AdminRoute;
