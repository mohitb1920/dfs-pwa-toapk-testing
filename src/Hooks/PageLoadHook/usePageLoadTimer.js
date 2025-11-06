import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { initGA, sendPageLoadTimeToGA4 } from "./ga4Utils";
import {
  clearPageTimer,
  getPageTimer,
  initPageTimer,
  markPageTimerLogged,
  onActiveRequestsChange,
} from "./apiTracker";

export const usePageLoadTimer = (timeoutMs = 15000) => {
  const location = useLocation();
  const [activeRequests, setActiveRequests] = useState(0); // Initialize with 0
  const timeoutRef = useRef(null);
  const unsubscribeRef = useRef(null);
  const pathRef = useRef(null);
  // Removed hasSetupListenerRef as it's not strictly necessary with the fix

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Memoized function to finalize timing
  const finalizePageLoadTime = useCallback(
    (reason = "api_complete") => {
      const pageTimer = getPageTimer(location.pathname);

      if (!pageTimer || pageTimer.hasLogged || !pageTimer.isActive) {
        console.debug(
          `Skipping finalization - no timer, already logged, or inactive. Reason: ${reason}`
        );
        return;
      }

      const loadTime = performance.now() - pageTimer.startTime;
      console.debug(
        `🎯 Page load complete (${reason}): ${
          location.pathname
        } in ${loadTime.toFixed(2)}ms`
      );

      // Send to GA4
      sendPageLoadTimeToGA4(location.pathname, loadTime);

      // Mark as logged
      markPageTimerLogged(location.pathname);

      // Clear timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
    [location.pathname]
  );

  // Initialize timer - ONLY when path actually changes
  useEffect(() => {
    if (pathRef.current === location.pathname) {
      console.debug(`Skipping timer init - same path: ${location.pathname}`);
      return;
    }

    console.debug(`🚀 Starting page load timer for: ${location.pathname}`);
    pathRef.current = location.pathname;

    // Initialize timer (will reuse existing if present)
    clearPageTimer(pathRef.current);
    const pageTimer = initPageTimer(location.pathname);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Set timeout fallback
    timeoutRef.current = setTimeout(() => {
      console.debug(`⏰ Timeout reached for ${location.pathname}`);
      finalizePageLoadTime("timeout");
    }, timeoutMs);

    // No need to reset hasSetupListenerRef.current here

    return () => {
      console.debug(`🧹 Cleaning up timer for: ${location.pathname}`);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Also clean up listener on unmount/path change
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [location.pathname, timeoutMs, finalizePageLoadTime]);

  // Set up API listener - ONLY ONCE per path
  useEffect(() => {
    // If the path changes, or if the listener isn't set up yet for the current path
    if (unsubscribeRef.current && pathRef.current === location.pathname) {
      // Already subscribed for this path.
      return;
    }

    console.debug(`Setting up API listener for: ${location.pathname}`);

    // Clean up previous listener if it exists (e.g., if path changed)
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    unsubscribeRef.current = onActiveRequestsChange((count) => {
      console.debug(
        `📊 Active requests: ${count} for path: ${location.pathname}`
      );
      setActiveRequests(count);
    });

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [location.pathname]); // Dependency on location.pathname to re-run when path changes

  // Handle API completion - with additional safeguards
  useEffect(() => {
    // Ensure the listener is effectively set up before evaluating activeRequests
    // Check if the current path matches the path for which the listener was intended
    const pageTimer = getPageTimer(location.pathname);

    if (
      activeRequests === 0 &&
      pageTimer &&
      !pageTimer.hasLogged &&
      pageTimer.isActive
    ) {
      console.debug(`🎬 All APIs complete, waiting for paint...`);

      // Wait for DOM updates and paint
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            // Double-check the state hasn't changed
            const currentTimer = getPageTimer(location.pathname);
            if (
              currentTimer &&
              !currentTimer.hasLogged &&
              currentTimer.isActive
            ) {
              finalizePageLoadTime("api_complete");
            }
          }, 16);
        });
      });
    }
  }, [activeRequests, finalizePageLoadTime, location.pathname]);

  // Debug return object
  const pageTimer = getPageTimer(location.pathname);
  return {
    activeRequests,
    isTracking: !!pageTimer && !pageTimer.hasLogged && pageTimer.isActive,
    hasLogged: pageTimer?.hasLogged || false,
    currentPath: location.pathname,
    startTime: pageTimer?.startTime || null,
    // Removed hasSetupListener as it's now implicitly handled
  };
};
