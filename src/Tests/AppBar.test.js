import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import AppAppBar from "../components/AppBar";

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = (loggedIn) => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <AppAppBar loggedIn={loggedIn} handleLogout={() => {}} />
      </Provider>
    </MemoryRouter>
  );
};

describe("App Bar", () => {
  test("renders App Bar component", () => {
    renderComponent(true);
  });

  test("Testing Navigation Button", () => {
    renderComponent(true);

    const buttons = screen.getAllByRole("button");
    const actionButton = buttons[0];
    fireEvent.click(actionButton);
  });

  test("Testing Menu Item Click", () => {
    renderComponent(true);
    window.innerWidth = 500;

    fireEvent(window, new Event("resize"));

    waitFor(() => {
      const buttons = screen.getAllByTestId("menu-item");
      const actionButton = buttons[0];
      fireEvent.click(actionButton);

      const logoutButton = screen.getByTestId("menu-item-logout");
      fireEvent.click(logoutButton);
    });
  });
  test("Testing AppBar click", () => {
    renderComponent(true);
    const buttons = screen.getAllByText("DFSWEB_HOME");
    const actionButton = buttons[0];
    fireEvent.click(actionButton);
  });
});
