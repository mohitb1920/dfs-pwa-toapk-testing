import React from "react";
import OTPPopup from "./OTPPopup";
import axiosInstance from "../../services/CreateAxios";
import { resendOtp } from "../../services/ResendOtp";
import { useDispatch } from "react-redux";
import { dispatchNotification } from "../../components/Utils";

export const DBTSyncOTPPopup = ({
  setRegistrationFormDetails,
  dbtId,
  setDataFromDBT,
  maskedMobileNumber,
  authToken,
  open,
  onClose,
  setSelectedAddress,
  errorMessageOTPValidation,
  setErrorMessageOTPValidation,
  OTPResentMessage,
  setOTPResentMessage,
  farmerResponse,
  setFarmerResponse,
  otp,
  setOtp,
  t,
}) => {
  function calculateAgeByDOB(dob) {
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();

      return currentYear - birthYear;
    }
    return "";
  }
  const dispatch = useDispatch();

  function maskAccountNumber(accountNumber) {
    const str = accountNumber.toString();
    return `XXXX-XXXX-${str.slice(-4)}`;
  }

  function handleFarmerDetails(farmerDataFromDBT) {
    const registrationFormDetailsTemp = {
      farmerName: farmerDataFromDBT.Individual?.name?.givenName || "",
      farmerRelativeName: farmerDataFromDBT.Individual?.fatherHusbandName || "",
      DOB: farmerDataFromDBT.Individual?.dateOfBirth || "",
      age: calculateAgeByDOB(farmerDataFromDBT.Individual?.dateOfBirth),
      farmerGender: farmerDataFromDBT.Individual?.gender || "",
      farmerMobileNumber: farmerDataFromDBT.Individual?.mobileNumber || "",
      farmerType: farmerDataFromDBT.Individual?.individualType || "",
      farmerCasteCategory: farmerDataFromDBT.Individual?.individualCast || "",
      farmerCategory: farmerDataFromDBT.Individual?.individualCategory || "",
      district: farmerDataFromDBT.Individual?.address[0]?.district || "",
      block: farmerDataFromDBT.Individual?.address[0]?.block || "",
      panchayat: farmerDataFromDBT.Individual?.address[0]?.panchayat || "",
      village: farmerDataFromDBT.Individual?.address[0]?.village || "",
      pincode: farmerDataFromDBT.Individual?.address[0]?.pincode || "",
      bankName: farmerDataFromDBT?.BankDetails?.bankName,
      accountNumber: maskAccountNumber(
        farmerDataFromDBT?.BankDetails?.accountNumber
      ),
      ifscCode: farmerDataFromDBT?.BankDetails?.ifscCode,
      bankBranchAddress: farmerDataFromDBT?.BankDetails?.bankBranchAddress,
    };
    setRegistrationFormDetails(registrationFormDetailsTemp);
    setSelectedAddress({
      district: farmerDataFromDBT?.Individual?.address[0]?.districtLG || "",
      block: farmerDataFromDBT?.Individual?.address[0]?.blockLG || "",
      panchayat: farmerDataFromDBT?.Individual.address[0]?.panchayatLG || "",
      village: farmerDataFromDBT?.Individual?.address[0]?.villageLG || "",
    });
  }

  const handleVerifyOTP = async () => {
    setOTPResentMessage(null);
    try {
      const response = await axiosInstance.post("/agent/v1/entity/_search", {
        RequestInfo: {
          authToken: authToken,
        },
        entitySearchRequest: {
          mobileNumber: null,
          dbtId: dbtId,
          ticketId: null,
          categoryType: "DBT_PROFILE_GET",
          tenantId: "br",
          otp: otp,
        },
      });

      const farmerDataFromDBT = response?.data?.proxyResponse;
      if (farmerDataFromDBT?.Individual?.address?.[0]?.villageLG != null) {
        setFarmerResponse(farmerDataFromDBT);
        handleFarmerDetails(farmerDataFromDBT);
        setDataFromDBT(true);
        setErrorMessageOTPValidation(null);
      } else {
        dispatchNotification("error", ["notAvaliable"], dispatch);
      }

      onClose();
    } catch (error) {
      const errorCode = error.response?.data?.Errors?.[0]?.code;

      const errorMessage =
        errorCode === "INCORRECT_OTP"
          ? t(`INCORRECT_OTP`)
          : t(`farmerRegistration.UNEXPECTED_ERROR`);
      setErrorMessageOTPValidation(errorMessage);
    }
    setOtp("");
  };

  const handleResendOTP = async () => {
    const body = {
      RequestInfo: {
        authToken: authToken,
      },
      otp: {
        mobileNumber: null,
        dbtId: dbtId,
        ticketId: null,
        categoryType: "DBT_PROFILE_GET",
        tenantId: "br",
        userType: "CITIZEN",
      },
    };
    resendOtp(body, setOtp, setOTPResentMessage, t, dispatch);
    setErrorMessageOTPValidation(null);
  };

  return (
    <>
      <OTPPopup
        {...{
          open,
          onClose,
          handleVerifyOTP,
          maskedMobileNumber,
          errorMessageOTPValidation,
          OTPResentMessage,
          otp,
          setOtp,
        }}
        onResend={handleResendOTP}
      />
    </>
  );
};
