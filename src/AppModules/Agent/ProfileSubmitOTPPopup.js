import React from "react";
import OTPPopup from "./OTPPopup";
import axiosInstance from "../../services/CreateAxios";
import { useTranslation } from "react-i18next";

export const ProfileSubmitOTPPopup = ({
  open,
  onClose,
  onResend,
  formData,
  authToken,
  dbtId,
  dataFromDBT,
  maskedMobileNumber,
  farmerResponse,
  errorMessageOTPValidation,
  setErrorMessageOTPValidation,
  OTPResentMessage,
  setOTPResentMessage,
  setIsSuccessDialogOpen,
  setIsUpdated,
  otp,
  setOtp,
}) => {
  function getValidateAndCreateProfileBody() {
    if (dataFromDBT)
      return {
        RequestInfo: {
          authToken: authToken,
        },
        proxyRequest: {
          mobileNumber: null,
          dbtId: dbtId,
          payload: farmerResponse,
          categoryType: "DBT_PROFILE_CREATE",
          tenantId: "br",
          otp: otp,
          echoResponse: null,
        },
      };
    else
      return {
        RequestInfo: {
          authToken: authToken,
        },
        proxyRequest: {
          mobileNumber: formData.farmerMobileNumber,
          dbtId: null,
          payload: farmerResponse,
          categoryType: "PROFILE_CREATE",
          tenantId: "br",
          otp: otp,
          echoResponse: null,
        },
      };
  }

  const { t } = useTranslation();

  const handleVerifyOTP = async () => {
    setOTPResentMessage(null);
    try {
      const response = await axiosInstance.post(
        "/agent/v1/proxy/_create",
        getValidateAndCreateProfileBody(otp)
      );

      const status = response.status;

      if (status === 200) setIsUpdated(true);
      else setIsUpdated(false);

      setErrorMessageOTPValidation(null);
      onClose();
      setIsSuccessDialogOpen(true);
    } catch (error) {
      const errorCode = error.response?.data?.Errors?.[0]?.code;

      const errorMessage =
        errorCode === "INCORRECT_OTP"
          ? t(`INCORRECT_OTP`)
          : errorCode === "UPDATE_NOT_SUPPORTED"
          ? t(`farmerRegistration.UPDATE_NOT_SUPPORTED`)
          : t(`farmerRegistration.UNEXPECTED_ERROR`);
      setErrorMessageOTPValidation(errorMessage);
    }
    setOtp("");
  };

  return (
    <>
      <OTPPopup
        {...{
          open,
          onClose,
          onResend,
          handleVerifyOTP,
          maskedMobileNumber,
          errorMessageOTPValidation,
          OTPResentMessage,
          otp,
          setOtp,
        }}
      />
    </>
  );
};
