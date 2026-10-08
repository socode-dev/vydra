import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiCheckCircle, FiClock, FiLink } from "react-icons/fi";
import AuthFormShell from "../components/auth/AuthFormShell";
import AuthFooter from "../components/auth/AuthFooter";
import PasswordField from "../components/auth/PasswordField";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useInviteActivation from "../hooks/useInviteActivation";

const ActivateInvite = () => {
  const [searchParams] = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token")?.trim() ?? "",
    [searchParams],
  );
  const {
    error,
    form,
    handleChange,
    handleSubmit,
    invite,
    status,
  } = useInviteActivation(token);

  const submitting = status === "submitting";

  if (status === "validating") {
    return (
      <AuthFormShell
        title="Activate your account"
        description="We are checking the invitation linked to your account."
      >
        <div
          role="status"
          className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
        >
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-info-soft text-primary">
            <LoadingSpinner
              compact
              color="currentColor"
              borderTopColor="transparent"
              size={20}
            />
          </span>
          <p className="mt-4 text-sm text-muted-foreground">
            Checking your activation link...
          </p>
        </div>
      </AuthFormShell>
    );
  }

  if (status === "invalid" || status === "expired") {
    return (
      <AuthFormShell
        title="Activation link unavailable"
        description="This invitation cannot be used to create or activate an account."
      >
        <div className="rounded-2xl border border-danger/20 bg-danger-soft p-5">
          <span className="flex size-11 items-center justify-center rounded-xl bg-danger/50 text-danger shadow-xs">
            <FiLink aria-hidden="true" size={21} />
          </span>
          <Alert className="mt-4 border-0 bg-transparent p-0" role="alert">
            {error ||
              (status === "expired"
                ? "This invitation has expired."
                : "This invitation is invalid or no longer available.")}
          </Alert>
        </div>
        <AuthFooter to="/login" linkText="Back to login">
          Need a different account?
        </AuthFooter>
      </AuthFormShell>
    );
  }

  if (status === "success") {
    return (
      <AuthFormShell
        title="Account activated"
        description="Your Vydra account is ready to use."
      >
        <div className="mb-6 rounded-2xl border border-success/20 bg-success-soft p-5 text-center text-success">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-card shadow-xs">
            <FiCheckCircle aria-hidden="true" size={26} />
          </span>
          <p className="mt-4 text-sm leading-relaxed">
            Your invitation has been accepted successfully.
          </p>
        </div>
        <Button as={Link} to="/dashboard" className="w-full">
          Continue
        </Button>
      </AuthFormShell>
    );
  }

  return (
    <AuthFormShell
      title="Activate your account"
      description={
        invite?.expiresAtMs
          ? `This invitation is valid until ${new Date(invite.expiresAtMs).toLocaleDateString()}.`
          : "Use the details from your invitation to finish setting up Vydra."
      }
    >
      {error && <Alert className="mb-4">{error}</Alert>}

      <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <FiClock aria-hidden="true" className="shrink-0 text-primary" />
        <span>This invitation can only be used once.</span>
      </div>

      <form onSubmit={handleSubmit} aria-busy={submitting}>
        <fieldset disabled={submitting} className="min-w-0 space-y-4">
          <FormField id="activation-email" label="Email" required>
            {(fieldProps) => (
              <Input
                {...fieldProps}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                placeholder="Enter your email"
              />
            )}
          </FormField>

          <PasswordField
            id="activation-password"
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
          />

          <PasswordField
            id="activation-confirm-password"
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
          />

          <Button
            type="submit"
            loading={submitting}
            loadingText="Activating account..."
            className="w-full"
          >
            Activate now
          </Button>
        </fieldset>
      </form>

      <AuthFooter to="/login" linkText="Back to login">
        Already have an account?
      </AuthFooter>
    </AuthFormShell>
  );
};

export default ActivateInvite;
