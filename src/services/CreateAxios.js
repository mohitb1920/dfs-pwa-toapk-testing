import axios from "axios";
import { getCurrentLanguage } from "../components/Utils";
import {
  decrementRequests,
  incrementRequests,
} from "../Hooks/PageLoadHook/apiTracker";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});
const language = getCurrentLanguage();
axiosInstance.interceptors.request.use(
  (config) => {
    const isCritical = config.isCritical !== false;

    if (isCritical) {
      console.debug(`Critical Axios request started: ${config.url}`);
      incrementRequests();
    } else {
      console.debug(`Non-critical Axios request: ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error(`Axios request setup failed`, error);
    decrementRequests();
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    const isCritical = res.config.isCritical !== false;

    if (isCritical) {
      console.debug(
        `Critical Axios request completed: ${res.config.url}, status: ${res.status}`
      );
      decrementRequests();
    } else {
      console.debug(
        `Non-critical Axios response received: ${res.config.url}, status: ${res.status}`
      );
    }
    return res;
  },
  (err) => {
    const isCritical = err.config.isCritical !== false;

    if (isCritical) {
      console.error(`Critical Axios request failed: ${err.config.url}`, err);
      decrementRequests();
    } else {
      console.error(
        `Non-critical Axios request failed: ${err.config.url}`,
        err
      );
    }
    if (err?.response?.data?.Errors) {
      for (const error of err.response.data.Errors) {
        if (error?.message?.includes("Invalid Access Token Exception'")) {
          window.alert(
            language === "hi_IN"
              ? "आपका सत्र समाप्त हो गया है। कृपया जारी रखने के लिए लॉगिन करें।"
              : "Your session has expired. Please log in to continue."
          );

          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("DfsWeb")) {
              localStorage.removeItem(key);
            }
          });
          sessionStorage.clear();
          window.location.href = `${window?.contextPath}/login`;
        }
      }
    }
    throw err;
  }
);

export default axiosInstance;
