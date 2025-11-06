import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Schemes.css";
import { useDispatch } from "react-redux";
import OTPinput from "./OTPinput";
import { SchemeService } from "../services/Schemes";
import { dispatchNotification } from "./Utils";
import { CssTextField } from "./Form/CustomWidget";
import CustomButton from "./Button/CustomButton";
import "../styles/FarmerDbtVerification.css";

export const OtpInputRenderer = (props) => {
  const {
    mobileNumber,
    otpValue,
    setOtpValue,
    otpValidationError,
    setOtpValidationError,
    t,
    handleVerifyOtp,
    dispatch,
    isSubmit = false,
    onResendOtp,
    waitTime,
    setWaitTime,
    verificationLoading = false,
  } = props;

  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    } else if (timeLeft === 0) {
      setWaitTime(null);
    }
  }, [timeLeft]);

  useEffect(() => {
    setTimeLeft(waitTime);
  }, [waitTime]);

  const handleOTPClick = async () => {
    if (otpValue.length < 6) {
      dispatchNotification("error", ["INVALID_OTP"], dispatch);
      return;
    }
    handleVerifyOtp();
  };

  return (
    <Box className="otp-input-container">
      <Typography className="otp-set-sucess-msg">
        {t("schemes.otpSentMessage", { mobile: mobileNumber })}
      </Typography>
      <Typography className="enter-one-time-password-text">
        {t("schemes.enterOTP")}
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOTPClick();
        }}
      >
        <Box
          sx={{
            display: "flex",
            columnGap: "24px",
            rowGap: "1rem",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <OTPinput
            otp={otpValue}
            setOtp={setOtpValue}
            setSubmissionStatus={setOtpValidationError}
          />
          {!isSubmit && (
            <CustomButton
              type="submit"
              state={
                otpValue.length < 6 || verificationLoading
                  ? "disabled"
                  : "enabled"
              }
            >
              {t("schemes.verify")}
            </CustomButton>
          )}
          <Box className="flex items-center justify-center ml-2">
            {verificationLoading && (
              <CircularProgress color="success" size="32px" thickness={6} />
            )}
          </Box>
        </Box>
      </form>
      <Box className="mb-1 mt-3">
        {timeLeft > 0 ? (
          <Typography className="time-left" variant="caption">
            {`${t("agentGrm.COMMON_RESEND_ANOTHER_OTP")} ${timeLeft} ${t(
              "agentGrm.COMMON_RESEND_ANOTHER_OTP_TAIL"
            )}`}
          </Typography>
        ) : (
          <Button
            variant="text"
            size="small"
            onClick={onResendOtp}
            sx={{
              textDecoration: "underline",
              color: theme.palette.text.textGreen,
              paddingX: "0px !important",
            }}
          >
            {t("COMMON_RESEND_OTP")}
          </Button>
        )}
      </Box>
      {otpValidationError?.message && (
        <Box
          className={`${
            isDarkTheme ? "text-error-dark-theme" : "text-secondary"
          } mt-2`}
        >
          {t(otpValidationError.message)}
        </Box>
      )}
    </Box>
  );
};

function FarmerDbtVerification({
  handleVerifyOtp,
  otpValidationError,
  setOtpValidationError,
  otpValue,
  setOtpValue,
  categoryType = "PROFILE_GET",
  userType = "CITIZEN",
  verificationLoading = false,
  headerText = "",
}) {
  const [dbtValue, setDbtValue] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState(null);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:640px)");
  const isDarkTheme = theme.palette.mode === "dark";

  const handleDbtChange = (event) => {
    setMobileNumber("");
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 13) {
      setDbtValue(value);
    }
  };

  const handleClick = async () => {
    if (dbtValue.length === 0) {
      dispatchNotification("error", ["EMPTY_DBT_ID"], dispatch);
      return;
    } else if (dbtValue.length < 13) {
      dispatchNotification("error", ["INVALID_DBT_ID"], dispatch);
      return;
    }
    const requestData = {
      otp: {
        mobileNumber: null,
        dbtId: dbtValue,
        categoryType,
        userType,
        tenantId: "br",
      },
    };
    setLoading(true);
    try {
      const response = await SchemeService.otpFarmerSchemeGet(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        const contact = response?.message; // Converts string to a number
        setMobileNumber(contact);
        dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
        setWaitTime(30);
        setOtpValue("");
      } else {
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <Typography
          variant={isMobile ? "h5" : "h3"}
          className="verify-farmer-details-text"
        >
          {headerText ? t(headerText) : t("schemes.schemeVerifyFarmer")}
        </Typography>
        <Typography
          className="verify-farmer-details-subtext"
          sx={{ fontFamily: "Inter", textAlign: "left" }}
          variant="subtitle2"
        >
          {t("schemes.schemeVerifyFarmerSubtext")}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
        <Box className="farmer-dbt-input-section">
          <Typography className="farmer-dbt-input-header-text">
            {t("schemes.farmerDBTId")}
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClick();
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: "16px",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
              }}
            >
              <CssTextField
                value={dbtValue}
                onChange={handleDbtChange}
                sx={{
                  minWidth: { sm: "300px" },
                  width: { xs: "100%", sm: "fit-content" },
                }}
                darkTheme={isDarkTheme}
              />
              <CustomButton
                type="submit"
                state={
                  ((loading || dbtValue.length < 13))
                    ? "disabled"
                    : "enabled"
                }
              >
                {t("schemes.getOTP")}
              </CustomButton>
            </Box>
          </form>
          {loading && (
            <Typography color="primary" sx={{ marginTop: "8px" }}>
              {t("schemes.sendingOTP")}...
            </Typography>
          )}
        </Box>
        {mobileNumber && (
          <OtpInputRenderer
            mobileNumber={mobileNumber}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            otpValidationError={otpValidationError}
            setOtpValidationError={setOtpValidationError}
            handleVerifyOtp={() => handleVerifyOtp(otpValue, dbtValue)}
            dispatch={dispatch}
            t={t}
            waitTime={waitTime}
            setWaitTime={setWaitTime}
            onResendOtp={handleClick}
            verificationLoading={verificationLoading}
          />
        )}
      </Box>
    </>
  );
}

export default FarmerDbtVerification;
