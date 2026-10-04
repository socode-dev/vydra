import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthFormContext } from "../context/AuthFormContext";
import useAuthStore from "../store/useAuthStore";
import AuthLoadingScreen from "../components/ui/AuthLoadingScreen";
import { isDemoUser } from "../demo/useDemoMode";

const PublicRoute = ({ children }) => {
  const user = useAuthStore((state) => state.currentUser);
  const userLoggedIn = useAuthStore((state) => state.userLoggedIn);
  const loading = useAuthStore((state) => state.loading);
  const { loginIsSubmitting, signupIsSubmitting } = useAuthFormContext();
  const submitting = loginIsSubmitting || signupIsSubmitting;
  const [initialized, setInitialized] = useState(!loading);

  useEffect(() => {
    if (!loading) setInitialized(true);
  }, [loading]);

  if (loading && !initialized && !submitting) {
    return <AuthLoadingScreen />;
  }

  if (!loading && userLoggedIn && !isDemoUser(user)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
