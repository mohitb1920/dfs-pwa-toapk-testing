// src/utils/ga4.js

// Updated sendPageLoadTimeToGA4 method to match your existing GA4 setup
export const sendPageLoadTimeToGA4 = (pagePath, loadTime) => {
  const roundedLoadTime = Math.round(loadTime);

  if (
    !GA_ENABLED ||
    !GA_MEASUREMENT_ID ||
    typeof window === "undefined" ||
    !window.gtag
  ) {
    console.debug(
      `GA4 not available (${ENVIRONMENT}). Page load time:`,
      pagePath,
      roundedLoadTime + "ms"
    );
    return;
  }

  try {
    window.gtag("event", "page_load_time_web", {
      page_path: pagePath,
      load_time: roundedLoadTime,
      custom_parameter_1: "page_fully_loaded_web",
      environment: ENVIRONMENT,
      event_category: "performance",
      event_label: pagePath,
    });
    console.debug(
      `✅ GA4 Event sent - Page: ${pagePath}, Load Time: ${roundedLoadTime}ms, Environment: ${ENVIRONMENT}`
    );
  } catch (error) {
    console.error("Error sending GA4 page load time event:", error);
  }
};

// Dynamic GA4 Measurement ID based on environment (similar to your axios setup)
const getGA4Config = () => {
  const origin = window.location.origin;

  if (origin.includes("dfsdev")) {
    return {
      measurementId: "G-3ZMKPYW53C",
      enabled: true,
      environment: "dfsdev",
    };
  } else if (origin.includes("dfsqa")) {
    return {
      measurementId: "G-KP0RM36CJT",
      enabled: true,
      environment: "dfaQA",
    };
  } else if (origin.includes("staging")) {
    return {
      measurementId: null,
      enabled: false,
      environment: "staging",
    };
  } else if (origin.includes("biharkrishi")) {
    return {
      measurementId: "G-71TRE2K99N",
      enabled: true,
      environment: "biharkrishi",
    };
  } else {
    return {
      measurementId: null, // Set to null if you don't have dev GA4, or add your dev ID here
      enabled: false, // Disable analytics in development
      environment: "development",
    };
  }
};

const GA_CONFIG = getGA4Config();
export const GA_MEASUREMENT_ID = GA_CONFIG.measurementId;
export const GA_ENABLED = GA_CONFIG.enabled;
export const ENVIRONMENT = GA_CONFIG.environment;

// Initialize Google Analytics
export const initGA = () => {
  // Don't initialize if GA is disabled or no measurement ID
  if (!GA_ENABLED || !GA_MEASUREMENT_ID) {
    console.log(`GA4 disabled for ${ENVIRONMENT} environment`);
    return;
  }

  try {
    // Load gtag script
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    console.log(
      `GA4 initialized for ${ENVIRONMENT} with ID:`,
      GA_MEASUREMENT_ID
    );
  } catch (error) {
    console.warn("GA4 initialization failed:", error);
  }
};

// Track page views
export const trackPageView = (path, title) => {
  if (!GA_ENABLED || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }

  try {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  } catch (error) {
    console.warn("GA4 page view tracking failed:", error);
  }
};

// Track custom events
export const trackEvent = (eventName, parameters = {}) => {
  if (!GA_ENABLED || !GA_MEASUREMENT_ID || !window.gtag) {
    // Log events in development/disabled environments for debugging
    console.log(`GA4 Event (${ENVIRONMENT}):`, eventName, parameters);
    return;
  }

  try {
    window.gtag("event", eventName, {
      event_category: parameters.category || "engagement",
      event_label: parameters.label,
      value: parameters.value,
      ...parameters,
    });

    console.log("GA4 Event sent:", eventName, parameters);
  } catch (error) {
    console.warn("GA4 event tracking failed:", error);
  }
};

// Track user properties
export const setUserProperties = (properties) => {
  if (!GA_ENABLED || !GA_MEASUREMENT_ID || !window.gtag) {
    console.log(`GA4 User Properties (${ENVIRONMENT}):`, properties);
    return;
  }

  try {
    window.gtag("set", "user_properties", properties);
  } catch (error) {
    console.warn("GA4 user properties failed:", error);
  }
};
