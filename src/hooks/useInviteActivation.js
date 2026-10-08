import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { doCreateUserWithEmailAndPassword, doSignOut } from "../firebase/auth";
import { activateInviteToken, validateInviteToken } from "../api/invites";
import { getAuthErrorMessage } from "../utils/authErrorrs";

const waitForSignedOut = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth, user => {
        if (user) return;

        unsubscribe();
        resolve();
      },
      reject,
    );
  });
};

const signOutForActivation = async () => {
  if (!auth.currentUser) return;

  const signedOut = waitForSignedOut();

  await doSignOut();
  await signedOut;
};

const getActivationErrorMessage = (error) => {
  if (error?.code?.startsWith("auth/")) return getAuthErrorMessage(error);

  return error?.message || "Activation could not be completed.";
};

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
};

const useInviteActivation = (token) => {
  const [status, setStatus] = useState("validating");
  const [invite, setInvite] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const prepareActivation = async () => {
      setStatus("validating");
      setError("");
      setInvite(null);
      setForm(initialForm);

      if (!token) {
        setStatus("invalid");
        setError("Activation link is missing its invite token.");
        return;
      }

      try {
        await signOutForActivation();

        const validatedInvite = await validateInviteToken(token);

        if (cancelled) return;

        setInvite(validatedInvite);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;

        setError(
          err?.code?.startsWith("auth/")
            ? "We could not prepare account activation. Please refresh and try again."
            : err?.message || "Activation link could not be validated."
        );

        setStatus(err.code === "INVITE_EXPIRED" ? "expired" : "invalid");
      }
    };

    prepareActivation();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "submitting") return;

    setError("");

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setStatus("submitting");

      await doCreateUserWithEmailAndPassword(
        form.email.trim(),
        form.password
      );

      await activateInviteToken({ token });

      setStatus("success");
    } catch (err) {
      setError(getActivationErrorMessage(err));
      setStatus("ready");
    }
  };

  return {
    error,
    form,
    handleChange,
    handleSubmit,
    invite,
    status,
  };
};

export default useInviteActivation;
