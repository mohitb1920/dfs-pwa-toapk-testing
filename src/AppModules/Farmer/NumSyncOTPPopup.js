import { useState } from "react";
import axiosInstance from "../../services/CreateAxios";
import { blockToEnglish, dispatchNotification } from "../../components/Utils";
import ChangeNumOTPPopup from "./ChangeNumOTPPopup";
import ForceLogoutPopup from "./ForceLogoutPopup";
import EnterNumPopup from "./EnterNumPopup";
import { sendOtp } from "../../services/loginService";
import { getFarmerData } from "../../services/FarmerDbtDetails";
import { editFarmerResponse } from "../Agent/FarmerEditResposne";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

export const NumSyncOTPPopup = ({
  dbtId,
  maskedMobileNumber,
  authToken,
  open,
  onClose,
  errorMessageOTPValidation,
  setErrorMessageOTPValidation,
  OTPResentMessage,
  otp,
  setOtp,
  t,
  profileData,
}) => {
  const [stepper, setStepper] = useState(0);
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      const farmerData = await getFarmerData(dbtId);
      const farmerDataFromDBT = farmerData?.data;
      if (farmerDataFromDBT?.Individual?.address?.[0]?.villageLG != null) {
        const address = handleSelectedAddress(farmerDataFromDBT);
        const req = editFarmerResponse(
          null,
          address,
          null,
          farmerDataFromDBT,
          profileData
        );
        const response = await axiosInstance.post(
          "/farmer-profile/v1/_update",
          {
            RequestInfo: {
              authToken: authToken,
            },
            Individual: req.Individual,
            BankDetails: req.BankDetails,
            otpReference: otp,
          }
        );
        if (response?.data?.responseInfo?.status === "successful") {
          setStepper(2);
        }
      }
    } catch (error) {
      setErrorMessageOTPValidation(t("OTP_VALIDATION_FAILED"));
      setOtp("");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const body = {
      otp: {
        mobileNumber: mobile,
        userType: "CITIZEN",
        type: "REGISTER",
        tenantId: "br",
      },
    };
    const res = await sendOtp(body);
    if ( res.data.isSuccessful ) {
      dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
    } else {
      dispatchNotification(
        "error",
        [`${t("farmerRegistration.OTP_RESEND_FAILED")}`],
        dispatch
      );
    }
    setErrorMessageOTPValidation(null);
    setOtp("");
  };

  return (
    <>
      {stepper === 0 && (
        <EnterNumPopup
          dbtId={dbtId}
          open={open}
          onClose={onClose}
          mobile={mobile}
          setMobile={setMobile}
          setStepper={setStepper}
          maskedMobileNumber={maskedMobileNumber}
        />
      )}
      {stepper === 1 && (
        <ChangeNumOTPPopup
          {...{
            open,
            onClose,
            handleVerifyOTP,
            maskedMobileNumber,
            errorMessageOTPValidation,
            setErrorMessageOTPValidation,
            OTPResentMessage,
            otp,
            setOtp,
          }}
          onResend={handleResendOTP}
          setStepper={setStepper}
          loading={loading}
        />
      )}
      {stepper === 2 && (
        <ForceLogoutPopup
          open={open}
          onClose={onClose}
          setStepper={setStepper}
        />
      )}
    </>
  );
};

NumSyncOTPPopup.propTypes = {
  dbtId: PropTypes.string,
  maskedMobileNumber: PropTypes.string,
  authToken: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  errorMessageOTPValidation: PropTypes.string,
  setErrorMessageOTPValidation: PropTypes.func,
  OTPResentMessage: PropTypes.string,
  otp: PropTypes.string,
  setOtp: PropTypes.func,
  t: PropTypes.func,
  profileData: PropTypes.object,
};

function calculateAgeByDOB(dob) {
  if (dob) {
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();

    return currentYear - birthYear;
  }
  return null;
}

function maskAccountNumber(accountNumber) {
  if (!accountNumber) return null;
  const str = accountNumber.toString();
  return `XXXX-XXXX-${str.slice(-4)}`;
}

function stringToDate(dateString) {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
}

export function handleFarmerDetails(farmerDataFromDBT) {
  const registrationFormDetailsTemp = {
    farmerName: farmerDataFromDBT.Individual?.name?.givenName || "",
    farmerRelativeName: farmerDataFromDBT.Individual?.fatherHusbandName || "",
    DOB: stringToDate(farmerDataFromDBT.Individual?.dateOfBirth) || "",
    age: calculateAgeByDOB(farmerDataFromDBT.Individual?.dateOfBirth) || "",
    farmerGender: blockToEnglish?.[farmerDataFromDBT.Individual?.gender] || "",
    farmerMobileNumber: farmerDataFromDBT.Individual?.mobileNumber || "",
    farmerType:
      blockToEnglish?.[farmerDataFromDBT.Individual?.individualType] || "",
    farmerCasteCategory:
      blockToEnglish?.[farmerDataFromDBT.Individual?.individualCast] || "",
    farmerCategory:
      blockToEnglish?.[farmerDataFromDBT.Individual?.individualCategory] || "",
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

  return registrationFormDetailsTemp;
}

export function handleSelectedAddress(farmerDataFromDBT) {
  const address = {
    district: farmerDataFromDBT?.Individual?.address[0]?.districtLG || "",
    block: farmerDataFromDBT?.Individual?.address[0]?.blockLG || "",
    panchayat: farmerDataFromDBT?.Individual?.address[0]?.panchayatLG || "",
    village: farmerDataFromDBT?.Individual?.address[0]?.villageLG || "",
  };
  return address;
}
