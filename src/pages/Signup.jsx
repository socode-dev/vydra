import { useState } from "react";
import { useAuthFormContext } from "../context/AuthFormContext";
import useThresholdForm from "../hooks/useThresholdForm";
import { getThresholdsValue } from "../utils/getValues";
import useAuthStore from "../store/useAuthStore";
import AuthFormShell from "../components/auth/AuthFormShell";
import AuthFooter from "../components/auth/AuthFooter";
import PasswordField from "../components/auth/PasswordField";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";

const Signup = () => {
  const onSignup = useAuthStore((state) => state.onSignup);
  const onGoogleSignIn = useAuthStore((state) => state.onGoogleSignIn);
  const onMicrosoftSignIn = useAuthStore((state) => state.onMicrosoftSignIn);
  const onSignupErr = useAuthStore((state) => state.onSignupErr);
  const googleErr = useAuthStore((state) => state.googleErr);
  const microsoftErr = useAuthStore((state) => state.microsoftErr);
  const {
    signupRegister: register,
    signupErrors: errors,
    signupIsSubmitting: isSubmitting,
    signupHandleSubmit: handleSubmit,
    signupFormReset: reset,
  } = useAuthFormContext();
  const { getValues } = useThresholdForm();
  const [socialPending, setSocialPending] = useState(false);
  const busy = isSubmitting || socialPending;

  return (
    <AuthFormShell
      title="Create an Account"
      description="Let's get you set up with Vydra account."
    >
      {[onSignupErr, googleErr, microsoftErr]
        .filter(Boolean)
        .map((error, index) => (
          <Alert key={index} className="mb-4">
            {error}
          </Alert>
        ))}
      <form
        noValidate
        onSubmit={handleSubmit(async (data) => {
          if (socialPending) return;
          const result = await onSignup(data, getThresholdsValue(getValues));
          if (result?.ok) reset();
        })}
        aria-busy={busy}
      >
        <fieldset disabled={busy} className="min-w-0 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="first-name"
              label="First Name"
              required
              error={errors.firstName}
            >
              {(fieldProps) => (
                <Input
                  {...register("firstName")}
                  {...fieldProps}
                  autoComplete="given-name"
                  placeholder="Enter your first name"
                />
              )}
            </FormField>
            <FormField
              id="last-name"
              label="Last Name"
              required
              error={errors.lastName}
            >
              {(fieldProps) => (
                <Input
                  {...register("lastName")}
                  {...fieldProps}
                  autoComplete="family-name"
                  placeholder="Enter your last name"
                />
              )}
            </FormField>
          </div>
          <FormField
            id="signup-email"
            label="Email"
            required
            error={errors.email}
          >
            {(fieldProps) => (
              <Input
                {...register("email")}
                {...fieldProps}
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
              />
            )}
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <PasswordField
              {...register("password")}
              id="signup-password"
              label="Password"
              className="mb-0"
              error={errors.password}
              placeholder="Enter password"
            />
            <PasswordField
              {...register("confirmPassword")}
              id="confirm-password"
              label="Confirm Password"
              className="mb-0"
              error={errors.confirmPassword}
              placeholder="Confirm password"
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            loadingText="Creating account..."
            disabled={busy}
          >
            Create Account
          </Button>
        </fieldset>
      </form>
      <SocialAuthButtons
        verb="sign up"
        disabled={isSubmitting}
        onPendingChange={setSocialPending}
        onGoogle={() => onGoogleSignIn(getThresholdsValue(getValues))}
        onMicrosoft={() => onMicrosoftSignIn(getThresholdsValue(getValues))}
      />
      <AuthFooter to="/login" linkText="Log in">
        Already have an account?
      </AuthFooter>
    </AuthFormShell>
  );
};

export default Signup;
