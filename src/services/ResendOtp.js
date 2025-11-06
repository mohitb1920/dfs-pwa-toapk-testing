import { dispatchNotification } from "../components/Utils";
import { urls } from "../Utils/Urls";
import axiosInstance from "./CreateAxios";
export const resendOtp = async (
  body,
  setOtp,
  setOTPResentMessage,
  t,
  dispatch
) => {
  setOtp("");
  setOTPResentMessage("");
  try {
    const response = await axiosInstance.post(urls.Agent_OTP_Send, body);
    if (
      response.data.ResponseInfo &&
      response.data.ResponseInfo.status === "successful"
    ) {
      dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
      // setOTPResentMessage(`${t("schemes.otpSuccess")}`);
    } else {
      dispatchNotification(
        "error",
        [`${t("farmerRegistration.OTP_RESEND_FAILED")}`],
        dispatch
      );
      // setOTPResentMessage(`${t("farmerRegistration.OTP_RESEND_FAILED")}`);
    }
  } catch (error) {
    setOTPResentMessage(`${error.message}`);
  }
};
