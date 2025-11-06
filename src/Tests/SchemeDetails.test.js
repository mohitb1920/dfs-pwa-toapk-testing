import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import SchemeDetails from "../pages/Schemes/SchemeDetails";

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <SchemeDetails />
      </Provider>
    </MemoryRouter>
  );
};

describe("Scheme Details Page", () => {
  test("renders scheme details component", () => {
    renderComponent();
  });

  test("Testing Apply Button", () => {
    renderComponent();
    const applyButton = screen.getByRole("button");
    fireEvent.click(applyButton);
  });
});
