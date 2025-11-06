import { fireEvent, render, screen } from "@testing-library/react";
import AllSchemes from "../pages/Schemes/AllSchemes";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";

const store = configureStore({
  reducer: rootReducer,
});

const schemeTypes = [
  "agricultureSchemes",
  "fisheriesSchemes",
  "horticultureSchemes",
];

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <AllSchemes schemeTypes={schemeTypes} />
      </Provider>
    </MemoryRouter>
  );
};

describe("All Schemes", () => {
  test("render all schemes", () => {
    renderComponent();
  });
  test("onMoreClick dispatches action and navigates", () => {
    renderComponent();

    const moreInfoButtons = screen.getAllByTestId("more-info-button");
    expect(moreInfoButtons.length).toBeGreaterThan(0);

    const moreButtonToInteractWith = moreInfoButtons[0];
    fireEvent.click(moreButtonToInteractWith, "PJYM");
  });
  test("more Schemes Button to display More Schemes", () => {
    renderComponent();

    const moreSchemesButtons = screen.getAllByTestId("more-schemes-button");
    expect(moreSchemesButtons.length).toBeGreaterThan(0);

    const moreButtonToInteractWith = moreSchemesButtons[0];
    fireEvent.click(moreButtonToInteractWith, "agricultureSchemes");

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton, "");
  });
});
