import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import LandingPage from "../pages/LandingPage"
const store = configureStore({
  reducer: rootReducer,
});

describe("i18n Configuration", () => {
  test("renders with default language", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <Provider store={store}>
            <LandingPage />
          </Provider>
        </MemoryRouter>
      </I18nextProvider>
    );
  });
});
