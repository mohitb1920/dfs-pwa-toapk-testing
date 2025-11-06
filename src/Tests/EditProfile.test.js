import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import EditProfile from "../pages/LoginSignupOtp/EditProfile";
import { localStorageMock } from "../components/MockData";
import { PASSWORD_ERROR } from "../constants";
import { changePassword, updateUser } from "../services/loginService";
import NotificationSelector from "../NotificationSelector";

const store = configureStore({
  reducer: rootReducer,
});

jest.mock("../services/loginService");

const renderComponent = () => {
  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "DfsWeb.user-info",
    JSON.stringify({
      name: "L1-User",
      emailId: "l1user@dummy.com",
      mobileNumber: "9847564738",
      username: "l1user",
    })
  );
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <NotificationSelector>
          <EditProfile />
        </NotificationSelector>
      </Provider>
    </MemoryRouter>
  );
};

describe("Edit Profile Page", () => {
  test("renders Edit Profile component", () => {
    renderComponent();
  });

  test("testing Fullname Input", () => {
    renderComponent();
    const input = screen.getByPlaceholderText("Enter your fullname here");
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "Jane Doe" } });
    expect(input.value).toBe("Jane Doe");
  });

  test("testing Mobile Input", () => {
    renderComponent();
    const mobileInput = screen.getByPlaceholderText("9876543210");
    expect(mobileInput).toBeInTheDocument();
    fireEvent.change(mobileInput, { target: { value: "abcd" } });
    expect(mobileInput.value).toBe("");
    fireEvent.change(mobileInput, { target: { value: "8847583" } });
    expect(
      screen.getByText("COMMON_MOBILE_VALIDATION_ERROR")
    ).toBeInTheDocument();

    fireEvent.change(mobileInput, { target: { value: "8847583865" } });
    expect(mobileInput.value).toBe("8847583865");
  });

  test("testing Change Password button", () => {
    renderComponent();
    const changePasswordButton = screen.getByText("COMMON_CHANGE_PASSWORD");
    fireEvent.click(changePasswordButton);
    expect(screen.getByText("COMMON_CURRENT_PASSWORD *")).toBeInTheDocument();

    fireEvent.click(changePasswordButton);
  });

  test("testing Password Change", async () => {
    renderComponent();
    const changePasswordButton = screen.getByText("COMMON_CHANGE_PASSWORD");
    fireEvent.click(changePasswordButton);

    const currentPasswordInput = screen.getByTestId("current-password");
    fireEvent.change(currentPasswordInput, { target: { value: "Abc@4327" } });
    expect(currentPasswordInput.value).toBe("Abc@4327");

    const newPasswordInput = screen.getByTestId("new-password");
    fireEvent.change(newPasswordInput, { target: { value: "abc@4327" } });
    fireEvent.blur(newPasswordInput);
    expect(screen.getByText("COMMON_PASSWORD_VALIDATION_ERROR")).toBeInTheDocument();
    fireEvent.change(newPasswordInput, { target: { value: "Abcd@1234" } });
    fireEvent.blur(newPasswordInput);
    expect(screen.queryByText("COMMON_PASSWORD_VALIDATION_ERROR")).not.toBeInTheDocument();
    expect(newPasswordInput.value).toBe("Abcd@1234");

    const confirmPasswordInput = screen.getByTestId("confirm-password");
    fireEvent.change(confirmPasswordInput, { target: { value: "abc@4327" } });
    const matchPasswordError = "COMMON_PASSWORDS_MISMATCH";
    expect(confirmPasswordInput.value).toBe("abc@4327");
    expect(screen.getByText(matchPasswordError)).toBeInTheDocument();
    fireEvent.change(confirmPasswordInput, { target: { value: "Abcd@1234" } });
    expect(screen.queryByText(matchPasswordError)).not.toBeInTheDocument();
    expect(confirmPasswordInput.value).toBe("Abcd@1234");

    const submitButton = screen.getByText("COMMON_SUBMIT");
    await waitFor(() => {
      updateUser.mockResolvedValueOnce({
        status: 200,
        data: {
          user: [
            {
              name: "l1user",
              emailId: "abcd@ymail.com",
              mobileNumber: "9845836374",
            },
          ],
        },
      });
    });
    await waitFor(() => {
      changePassword.mockResolvedValueOnce({
        status: 200,
      });
    });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(
        screen.getByText("COMMON_PASSWORD_UPDATE_SUCCESS")
      ).toBeInTheDocument();
    });
  });
});
