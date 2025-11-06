import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import Schemes from "../pages/Schemes/Schemes";

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <Schemes />
      </Provider>
    </MemoryRouter>
  );
};

describe("Schemes Page", () => {
  test("renders schemes component", () => {
    renderComponent();
  });
  test("Testing the filterIcon and filter Popup", () => {
    renderComponent();
    const avatar = screen.getByTestId("avatar");
    fireEvent.click(avatar);

    const checkboxes = screen.getAllByTestId("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
    const checkboxToInteractWith = checkboxes[0];
    // Simulate a change event on the checkbox
    fireEvent.click(checkboxToInteractWith, "agricultureSchemes", {
      target: { checked: true },
    });

    const arrowIcons = screen.getAllByTestId("keyboard-arrow-down-icon");
    expect(arrowIcons.length).toBeGreaterThan(0);
    const arrowIconToInteractWith = arrowIcons[1];
    fireEvent.click(arrowIconToInteractWith, "farmerTypes");

    const downArrowIcon = screen.getByTestId("keyboard-arrow-right-icon");
    fireEvent.click(downArrowIcon, "farmerTypes");
  });

  test("Testing Tab change", () => {
    renderComponent();

    const allSchemesTab = screen.getByTestId("all-schemes-tab");
    fireEvent.click(allSchemesTab, "all");

    const mySchemesTab = screen.getByTestId("my-schemes-tab");
    fireEvent.click(mySchemesTab, "mySchemes");
  });
});
