import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import LandingPage from "../pages/LandingPage";
import { localStorageMock } from "../components/MockData";

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = (loggedIn) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <LandingPage loggedIn={loggedIn} />
      </Provider>
    </MemoryRouter>
  );
};

describe("Signup Page", () => {
  test("renders Landing component", () => {
    renderComponent(true);
  });
  test("Testing Card Click", () => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem('DfsWeb.user-info', JSON.stringify({roles:[{code: 'AC'}]}));
    renderComponent(true);
    const landingPageCards = screen.getAllByTestId("feature-card");
    expect(landingPageCards.length).toBeGreaterThan(0);
    const cardToInteractWith = landingPageCards[0];
    fireEvent.click(cardToInteractWith, "/home");
  });
});
