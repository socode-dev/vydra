import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import useNotificationStore from "../store/useNotificationStore";
import useTransactionStore from "../store/useTransactionStore";
import { useDropdownClose } from "../hooks/useDropdownClose";
import useCurrencyStore from "../store/useCurrencyStore";
import useAuthStore from "../store/useAuthStore";
import { isDemoUser, useDemoMode } from "../demo/useDemoMode";
import { useLocation } from "react-router-dom";

const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const isDemoMode = useDemoMode();
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.currentUser);
  const isDemoSession = isDemoMode || isDemoUser(user);
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const loadTransactions = useTransactionStore(
    (state) => state.loadTransactions,
  );
  const loadNotifications = useNotificationStore(
    (state) => state.loadNotifications,
  );
  const fetchCurrencies = useCurrencyStore((state) => state.fetchCurrencies);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isSignoutPromptOpen, setIsSignoutPromptOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const settingsRef = useRef(null);
  const profileRef = useRef(null);

  useDropdownClose(
    isSettingsOpen,
    settingsRef,
    setIsSettingsOpen,
    setIsCurrencyOpen,
    setIsExportOpen,
  );
  useDropdownClose(isProfileOpen, profileRef, setIsProfileOpen);

  const handleSidebarOpen = useCallback(
    () => setIsSidebarOpen((prev) => !prev),
    [],
  );
  const handleSidebarClose = useCallback(() => setIsSidebarOpen(false), []);

  // Handle to open and close preferences
  const handlePreferencesOpen = useCallback(() => {
    setIsPreferencesOpen(true);
    setIsSettingsOpen(false);
  }, []);
  const handlePreferencesClose = useCallback(
    () => setIsPreferencesOpen(false),
    [],
  );

  // Handle to open and close settings
  const handleSettingsToggle = useCallback(() => {
    setIsProfileOpen(false);
    setIsCurrencyOpen(false);
    setIsExportOpen(false);
    setIsSettingsOpen((prev) => !prev);
  }, []);

  // Handle to open and close profile
  const handleProfileToggle = useCallback(() => {
    setIsSettingsOpen(false);
    setIsCurrencyOpen(false);
    setIsExportOpen(false);
    setIsProfileOpen((prev) => !prev);
  }, []);

  // Handle currency open and close
  const handleCurrencyToggle = useCallback(
    () => setIsCurrencyOpen((prev) => !prev),
    [],
  );
  const handleCurrencyClose = useCallback(() => setIsCurrencyOpen(false), []);

  const handleExportToggle = useCallback(
    () => setIsExportOpen((prev) => !prev),
    [],
  );

  // Handle Open Sign out prompt and close profile
  const handleSignoutPromptOpen = useCallback(() => {
    setIsSignoutPromptOpen(true);
    setIsProfileOpen(false);
  }, []);
  const handleSignoutPromptClose = useCallback(
    () => setIsSignoutPromptOpen(false),
    [],
  );

  // Load all transactions, budgets, goals on mount
  useEffect(() => {
    if (isDemoSession || !isDashboardRoute || !user?.uid) return;

    const currentUserId = user.uid;
    let isCancelled = false;

    const fetchUserData = async () => {
      try {
        const types = ["transactions", "budgets", "goals", "contributions"];

        await Promise.all([
          fetchCurrencies(),
          loadNotifications(currentUserId),
          ...types.map((label) => loadTransactions(currentUserId, label)),
        ]);

        if (isCancelled) return;
      } catch (err) {
        if (!isCancelled) {
          console.log("Error loading user financial data:", err);
        }
      }
    };

    fetchUserData();

    return () => {
      isCancelled = true;
    };
  }, [
    isDashboardRoute,
    isDemoSession,
    user,
    fetchCurrencies,
    loadNotifications,
    loadTransactions,
  ]);

  // Close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  return (
    <MainContext.Provider
      value={{
        settingsRef,
        profileRef,
        isSidebarOpen,
        isSettingsOpen,
        isProfileOpen,
        isPreferencesOpen,
        isCurrencyOpen,
        isExportOpen,
        isSignoutPromptOpen,
        handleSidebarOpen,
        handleSidebarClose,
        handlePreferencesOpen,
        handlePreferencesClose,
        handleSettingsToggle,
        handleProfileToggle,
        handleCurrencyToggle,
        handleCurrencyClose,
        handleSignoutPromptOpen,
        handleSignoutPromptClose,
        handleExportToggle,
        setIsExportOpen,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
