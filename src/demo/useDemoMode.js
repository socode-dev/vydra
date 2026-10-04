import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export const DEMO_BASE_PATH = "/demo";
export const CUSTOMER_BASE_PATH = "/dashboard";
export const DEMO_READ_ONLY_MESSAGE =
  "Demo Mode is read-only. Sign up to manage live customer data.";

export const useDemoMode = () => {
  const location = useLocation();
  return location.pathname === DEMO_BASE_PATH || location.pathname.startsWith(`${DEMO_BASE_PATH}/`);
};

export const isDemoUser = (user) => {
  return Boolean(user?.isDemo || user?.uid === "demo-mfb-customer");
};

export const getDemoPath = (path = "/") => {
  if (path === "/") return DEMO_BASE_PATH;
  return `${DEMO_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
};

export const getCustomerPath = (path = "/") => {
  if (path === "/") return CUSTOMER_BASE_PATH;
  return `${CUSTOMER_BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
};

export const showDemoReadOnlyToast = () => {
  toast(DEMO_READ_ONLY_MESSAGE, {
    duration: 3500,
  });
};
