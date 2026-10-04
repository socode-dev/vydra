import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Joyride from "react-joyride";
import useOnboardingStore from "../../store/useOnboardingStore";
import useAuthStore from "../../store/useAuthStore";
import { overviewSteps } from "../../data/joyrideSteps";
import { tourStyles } from "./tourStyles";

const TourJoyride = () => {
  const { pathname } = useLocation();
  const userId = useAuthStore((state) => state.currentUser?.uid);
  const tourActive = useOnboardingStore((state) => state.tourActive);
  const stopTour = useOnboardingStore((state) => state.stopTour);
  const disableTourForUser = useOnboardingStore(state => state.disableTourForUser);
  const [joyrideKey, setJoyrideKey] = useState(0);

  useEffect(() => {
    if (tourActive && pathname === "/dashboard") {
      setJoyrideKey((previous) => previous + 1);
    }
  }, [pathname, tourActive]);

  if (!tourActive || pathname !== "/dashboard") return null;

  const steps = overviewSteps.filter((step) => {
    if (typeof document === "undefined") return true;
    return Boolean(document.querySelector(step.target));
  });

  if (!steps.length) return null;

  return (
    <Joyride
      key={joyrideKey}
      steps={steps}
      continuous
      showSkipButton
      run
      disableBeacon
      disableOverlayClose
      hideCloseButton
      spotlightPadding={5}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip tour",
      }}
      callback={({ status }) => {
        if (status === "skipped") {
          disableTourForUser(userId);
        } else if (status === "finished") {
          stopTour();
        }
      }}
      styles={tourStyles}
    />
  );
};

export default TourJoyride;
