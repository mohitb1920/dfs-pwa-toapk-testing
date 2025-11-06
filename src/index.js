import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { QueryClient, QueryClientProvider } from "react-query";
import { createLogger } from "redux-logger";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./Modules";
import ScrollToTop from "./ScrollToTop";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const logger = createLogger();
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
store.subscribe(() => {});

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <ScrollToTop />
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

// ✅ Register service worker for PWA support
serviceWorkerRegistration.register();

reportWebVitals();
