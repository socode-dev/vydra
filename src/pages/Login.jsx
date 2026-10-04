import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { useAuthFormContext } from "../context/AuthFormContext";
import useThresholdForm from "../hooks/useThresholdForm";
import { getThresholdsValue } from "../utils/getValues";
import AuthFormShell from "../components/auth/AuthFormShell";
import AuthFooter from "../components/auth/AuthFooter";
import PasswordField from "../components/auth/PasswordField";
import SocialAuthButtons from "../components/auth/SocialAuthButtons";
import Alert from "../components/ui/Alert";
import Button from "../components/ui/Button";
import FormField from "../components/ui/FormField";
import Input from "../components/ui/Input";

const Login = () => {
  const onLogin = useAuthStore((state) => state.onLogin);
  const onGoogleSignIn = useAuthStore((state) => state.onGoogleSignIn);
  const onMicrosoftSignIn = useAuthStore((state) => state.onMicrosoftSignIn);
  const onLoginErr = useAuthStore((state) => state.onLoginErr);
  const googleErr = useAuthStore((state) => state.googleErr);
  const microsoftErr = useAuthStore((state) => state.microsoftErr);
  
  const {
    loginRegister: register,
    loginErrors: errors,
    loginIsSubmitting: isSubmitting,
    loginHandleSubmit: handleSubmit,
    loginFormReset: reset,
  } = useAuthFormContext();
  
  const { getValues } = useThresholdForm();
  const [socialPending, setSocialPending] = useState(false);
  const busy = isSubmitting || socialPending;
  
  return (
    <AuthFormShell
      title="Welcome Back"
      description="Sign in to access your financial intelligence dashboard."
    >
      {[onLoginErr, googleErr, microsoftErr]
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
          const result = await onLogin(data);
          if (result?.ok) reset();
        })}
        aria-busy={busy}
      >
        <fieldset disabled={busy} className="min-w-0 space-y-4">
          <FormField
            id="login-email"
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

          <PasswordField
            {...register("password")}
            id="login-password"
            label="Password"
            error={errors.password}
            autoComplete="current-password"
            placeholder="Enter your password"
            labelAction={
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:text-sm"
              >
                Forgot password?
              </Link>
            }
          />

          <Button
            type="submit"
            className="w-full"
            loading={isSubmitting}
            loadingText="Signing in..."
            disabled={busy}
          >
            Sign In
          </Button>
        </fieldset>
      </form>
      <SocialAuthButtons
        disabled={isSubmitting}
        onPendingChange={setSocialPending}
        onGoogle={() => onGoogleSignIn(getThresholdsValue(getValues))}
        onMicrosoft={() => onMicrosoftSignIn(getThresholdsValue(getValues))}
      />
      <AuthFooter to="/signup" linkText="Sign up">
        Don't have an account?
      </AuthFooter>
    </AuthFormShell>
  );
};
export default Login;
