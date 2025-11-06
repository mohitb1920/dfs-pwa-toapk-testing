import { decrementRequests, incrementRequests } from "./apiTracker";

export const trackedFetch = async (url, options = {}, isCritical = true) => {
  if (!isCritical) {
    console.debug(`Non-critical fetch to: ${url}`);
    return fetch(url, options);
  }

  console.debug(`Critical fetch started: ${url}`);
  incrementRequests();

  try {
    const response = await fetch(url, options);
    console.debug(
      `Critical fetch completed: ${url}, status: ${response.status}`
    );
    return response;
  } catch (error) {
    console.error(`Critical fetch failed: ${url}`, error);
    throw error;
  } finally {
    decrementRequests();
  }
};
