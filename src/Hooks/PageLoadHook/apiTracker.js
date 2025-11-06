let activeRequests = 0;
let listeners = new Set();
let pageTimers = new Map();
export const onActiveRequestsChange = (callback) => {
  if (typeof callback !== "function") {
    console.error("onActiveRequestsChange: callback must be a function");
    return () => {};
  }

  listeners.add(callback);
  console.debug(
    "onActiveRequestsChange - listener added, total:",
    listeners.size
  );

  // IMPORTANT: Call immediately with current state when a new listener is added
  // This ensures new listeners are aware of ongoing requests.
  try {
    callback(activeRequests);
  } catch (error) {
    console.error("Error calling new listener with current state:", error);
  }

  return () => {
    listeners.delete(callback);
    console.debug(
      "onActiveRequestsChange - listener removed, total:",
      listeners.size
    );
  };
};
export const incrementRequests = () => {
  activeRequests++;
  console.debug("incrementRequests - count:", activeRequests);
  notifyListeners();
};

export const decrementRequests = () => {
  if (activeRequests > 0) {
    activeRequests--;
  }
  console.debug("decrementRequests - count:", activeRequests);
  notifyListeners();
};

export const getActiveRequestsCount = () => activeRequests;

export const resetRequestsCount = () => {
  activeRequests = 0;
  notifyListeners();
};

// Enhanced page timer management
export const initPageTimer = (path) => {
  if (!pageTimers.has(path)) {
    const timer = {
      startTime: performance.now(),
      hasLogged: false,
      isActive: true,
    };
    pageTimers.set(path, timer);
    console.debug(
      "initPageTimer - NEW timer for path:",
      path,
      "startTime:",
      timer.startTime
    );
    return timer;
  } else {
    const existing = pageTimers.get(path);
    console.debug(
      "initPageTimer - EXISTING timer for path:",
      path,
      "startTime:",
      existing.startTime
    );
    return existing;
  }
};

export const getPageTimer = (path) => {
  return pageTimers.get(path);
};

export const markPageTimerLogged = (path) => {
  const timer = pageTimers.get(path);
  if (timer) {
    timer.hasLogged = true;
    timer.isActive = false;
    console.debug("markPageTimerLogged - path:", path);
  }
};

export const clearPageTimer = (path) => {
  pageTimers.delete(path);
  console.debug("clearPageTimer - path:", path);
};

const notifyListeners = () => {
  console.debug(
    "notifyListeners - active requests:",
    activeRequests,
    "listeners:",
    listeners.size
  );
  listeners.forEach((callback) => {
    try {
      callback(activeRequests);
    } catch (error) {
      console.error("Error in activeRequests callback:", error);
    }
  });
};
