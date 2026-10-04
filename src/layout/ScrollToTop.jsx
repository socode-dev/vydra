import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    let frameId;

    const resetScrollPosition = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      document.querySelectorAll("main").forEach((mainElement) => {
        mainElement.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
    };

    resetScrollPosition();
    frameId = window.requestAnimationFrame(resetScrollPosition);

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
