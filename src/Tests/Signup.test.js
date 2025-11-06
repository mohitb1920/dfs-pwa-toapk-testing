import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import { authenticateUser } from "../services/loginService";
import { QueryClient, QueryClientProvider } from "react-query";
import { LoginComponent } from "../pages/MainLandingPage/Components/LoginComponent";

jest.mock("../services/loginService");

const store = configureStore({
  reducer: rootReducer,
});

const queryClient = new QueryClient();

const renderComponent = (loggedIn) => {
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <LoginComponent />
        </Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("Signup Page", () => {
  test("renders Signup component", () => {
    renderComponent(true);
  });

  test("Testing Username input", () => {
    renderComponent(false);
    const inputField = screen.getByLabelText("COMMON_USERNAME");
    fireEvent.change(inputField, { target: { value: "dfsdevuser" } });
    fireEvent.keyDown(inputField, { key: "Enter" });
  });

  test("Testing Password Input", () => {
    renderComponent(false);
    const inputField = screen.getByLabelText("COMMON_PASSWORD");
    fireEvent.change(inputField, { target: { value: "dfsdevuser" } });
    fireEvent.keyDown(inputField, { key: "Enter" });
  });

  test("Testing Submit", () => {
    renderComponent(false);
    authenticateUser.mockResolvedValueOnce({
      status: 200,
      data: { UserRequest: {}, access_token: "sbdnhasdj332" },
    });
    const usernameField = screen.getByLabelText("COMMON_USERNAME");
    const passwordField = screen.getByLabelText("COMMON_PASSWORD");
    fireEvent.change(usernameField, { target: { value: "dfsdevuser" } });
    fireEvent.change(passwordField, { target: { value: "1234567890" } });
    fireEvent.keyDown(passwordField, { key: "Enter" });
    authenticateUser.mockResolvedValueOnce({
      status: 400,
      response: { data: { error_description: "Incorrect password" } },
    });
    fireEvent.keyDown(passwordField, { key: "Enter" });
    authenticateUser.mockResolvedValueOnce({
      status: 404,
      response: {},
    });
    fireEvent.keyDown(passwordField, { key: "Enter" });
  });

  test("Testing Error Scenarios", async () => {
    renderComponent(false);
    const usernameField = screen.getByLabelText("COMMON_USERNAME");
    const passwordField = screen.getByLabelText("COMMON_PASSWORD");
    fireEvent.change(usernameField, { target: { value: "" } });
    fireEvent.change(passwordField, { target: { value: "" } });
    fireEvent.keyDown(passwordField, { key: "Enter" });
    const usernameErrorMessage = await screen.findByText(
      "COMMON_USERNAME_REQUIRED"
    );
    const passwordErrorMessage = await screen.findByText(
      "COMMON_PASSWORD_REQUIRED"
    );
    expect(usernameErrorMessage).toBeInTheDocument();
    expect(passwordErrorMessage).toBeInTheDocument();
    fireEvent.change(usernameField, { target: { value: "abcd" } });
    fireEvent.change(passwordField, { target: { value: "12345" } });
  });
});
