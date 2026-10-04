import { Routes, Route } from "react-router-dom";
import AuthLayout from "../layout/AuthLayouts";
import MainLayout from "../layout/MainLayout";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../layout/AdminLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ActivateInvite from "../pages/ActivateInvite";
import ErrorPage from "../pages/ErrorPage";
import ForgotPassword from "../pages/ForgotPassword";
import EmailVerified from "../pages/EmailVerified";
import DemoInitializer from "../demo/DemoInitializer";
import LazyWrapper from "./LazyWrapper";
import { dashboardPages } from "./dashboardPages";
import AuthLoadingScreen from "../components/ui/AuthLoadingScreen";
import AdminAccessPending from "../pages/AdminAccessPending";
import AdminOverview from "../pages/AdminOverview";
import AdminIntelligence from "../pages/AdminIntelligence";
import AdminDataOperations from "../pages/AdminDataOperations";
import AdminCustomerActivity from "../pages/AdminCustomerActivity";
import AdminInvestigation from "../pages/AdminInvestigation";
import MarketingHome from "../pages/MarketingHome";
import About from "../pages/About";

export default function AppRoutes() {
  const dashboardRoutes = dashboardPages.map(
    ({ path, Component, fallback }) => (
      <Route
        key={path || "overview"}
        index={!path}
        path={path}
        element={
          <LazyWrapper loadingFallback={fallback}>
            <Component />
          </LazyWrapper>
        }
      />
    ),
  );
  
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="activate" element={<ActivateInvite />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route
          path="email-verified"
          element={
            <ProtectedRoute>
              <EmailVerified />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
      </Route>
      <Route
        path="/demo"
        element={
          <DemoInitializer>
            <MainLayout />
          </DemoInitializer>
        }
      >
        {dashboardRoutes}
      </Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {dashboardRoutes}
      </Route>
      <Route
        path="/"
        element={
          <PublicRoute>
            <MarketingHome />
          </PublicRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="intelligence" element={<AdminIntelligence />} />
        <Route path="data-operations" element={<AdminDataOperations />} />
        <Route path="customer-activity" element={<AdminCustomerActivity />} />
        <Route path="investigation" element={<AdminInvestigation />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}
