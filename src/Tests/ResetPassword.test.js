import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../Modules";
import ResetPassword from "../pages/LoginSignupOtp/ResetPassword";
import { sendOtp } from "../services/loginService";
import { customExceptions } from "../constants";
import NotificationSelector from "../NotificationSelector";
import React from "react";

jest.mock("../services/loginService");

const store = configureStore({
  reducer: rootReducer,
});

const renderComponent = () => {
  return render(
    <MemoryRouter>
      <Provider store={store}>
        <NotificationSelector>
          <ResetPassword />
        </NotificationSelector>
      </Provider>
    </MemoryRouter>
  );
};

describe("Reset Password Page", () => {
  test("renders Reset Password component", () => {
    renderComponent();
  });

  test("testing Send Otp", async () => {
    renderComponent();
    const input = screen.getByTestId("mobile-input");

    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toBe("");

    fireEvent.change(input, { target: { value: "895846834" } });
    const sendOtpButton = screen.getByText("COMMON_SEND_OTP");
    fireEvent.click(sendOtpButton);
    expect(
      screen.getByText("COMMON_MOBILE_VALIDATION_ERROR")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "8958468347" } });
    expect(input.value).toBe("8958468347");
    await waitFor(() => {
      sendOtp.mockResolvedValueOnce({
        data: { error: { fields: [{ code: "OTP.UNKNOWN_MOBILE_NUMBER" }] } },
      });
    });
    fireEvent.click(sendOtpButton);
    await waitFor(() => {
      expect(
        screen.getByText(customExceptions["OTP.UNKNOWN_MOBILE_NUMBER"])
      ).toBeInTheDocument();
    });
  });

  test("testing reset password flow", async () => {
    // const setOtp = jest.fn();
    // const useStateMock = (otp) => [otp, setOtp];
    // jest.spyOn(React, "useState").mockImplementation(useStateMock);
    renderComponent();

    const input = screen.getByTestId("mobile-input");
    fireEvent.change(input, { target: { value: "8958468347" } });

    const sendOtpButton = screen.getByText("COMMON_SEND_OTP");
    await waitFor(() => {
      sendOtp.mockResolvedValueOnce({
        data: { isSuccessful: true },
      });
    });
    fireEvent.click(sendOtpButton);
    await waitFor(() => {
      expect(screen.getByText("COMMON_OTP_SENT_SUCCESSFULLY")).toBeInTheDocument();
    });
    // setOtp('123456');
    const usernameInput = screen.getByTestId("username-input");
    fireEvent.change(usernameInput, { target: { value: "l1user" } });
    expect(usernameInput.value).toBe("l1user");

    const newPasswordInput = screen.getByTestId("new-password");
    fireEvent.change(newPasswordInput, { target: { value: "Abcd@1234" } });
    expect(newPasswordInput.value).toBe("Abcd@1234");

    const confirmPasswordInput = screen.getByTestId("confirm-password");
    fireEvent.change(confirmPasswordInput, { target: { value: "Abcd@1234" } });
    expect(confirmPasswordInput.value).toBe("Abcd@1234");

    const submitButton = screen.getByText("COMMON_CHANGE_PASSWORD");
    fireEvent.click(submitButton);
  });
});
