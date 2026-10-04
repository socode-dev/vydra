import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiMail, FiRefreshCcw } from "react-icons/fi";
import { auth } from "../firebase/firebase";
import useAuthStore from "../store/useAuthStore";
import AuthFormShell from "../components/auth/AuthFormShell";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const EmailVerified = () => {
  const user = useAuthStore((state) => state.currentUser);
  const [status, setStatus] = useState("checking");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const checkVerification = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("AUTH_REQUIRED");
        await currentUser.reload();
        if (cancelled) return;
        const verified = currentUser.emailVerified;
        useAuthStore.setState({ isUserEmailVerified: verified });
        setStatus(verified ? "verified" : "unverified");
      } catch {
        if (!cancelled) setStatus("error");
      }
    };

    checkVerification();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = () => {
    setStatus("checking");
    setAttempt((value) => value + 1);
  };

  if (status === "verified") {
    return (
      <AuthFormShell
        title="Email verified"
        description="Your account is ready to use."
      >
        <div className="mb-6 rounded-2xl border border-success/20 bg-success-soft p-5 text-center text-success">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-card shadow-xs">
            <FiCheckCircle aria-hidden="true" size={26} />
          </span>
          <p className="mt-4 break-words text-sm leading-relaxed">
            {user?.email
              ? `${user.email} has been verified successfully.`
              : "Your email has been verified successfully."}
          </p>
        </div>
        <Button as={Link} to="/dashboard" className="w-full">
          Back to Dashboard
        </Button>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      title="Email verification"
      description="Confirm your email status before returning to your dashboard."
    >
      {status === "checking" ? (
        <div
          role="status"
          className="mb-6 rounded-2xl border border-border bg-card p-5 text-center text-sm text-muted-foreground shadow-sm"
        >
          <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-info-soft text-primary">
            <LoadingSpinner
              compact
              color="currentColor"
              borderTopColor="transparent"
              size={20}
            />
          </span>
          Checking your email verification...
        </div>
      ) : (
        <Alert tone={status === "error" ? "error" : "info"} className="mb-6">
          {status === "error"
            ? "We could not check your email verification. Please try again."
            : "Your email is not verified yet. Please check your inbox or spam folder for the verification link."}
        </Alert>
      )}
      <Button
        onClick={retry}
        loading={status === "checking"}
        loadingText="Checking verification..."
        className="w-full"
      >
        <span className="flex items-center justify-center gap-2">
          {status === "error" ? (
            <FiRefreshCcw aria-hidden="true" />
          ) : (
            <FiMail aria-hidden="true" />
          )}
          Check verification
        </span>
      </Button>
      <Button as={Link} to="/dashboard" variant="ghost" className="mt-3 w-full">
        Back to Dashboard
      </Button>
    </AuthFormShell>
  );
};

export default EmailVerified;
