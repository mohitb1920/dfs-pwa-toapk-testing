import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CssTextField } from "../../components/Form/CustomWidget";
import "../../styles/Schemes.css";
import { useDispatch } from "react-redux";
import { dispatchNotification } from "../../components/Utils";
import { SchemeService } from "../../services/Schemes";
import { customExceptions } from "../../constants";
import OTPinput from "../../components/OTPinput";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonState } from "../../components/Button/ButtonEnums";

function FarmerDBTInput({ handleVerify, handleFarmerData }) {
  const [mobile, setMobile] = useState(null);
  const [dbtValue, setDbtValue] = useState("");

  const [otpError, setOtpError] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for OTP request
  const [otpSuccess, setOtpSuccess] = useState(false);

  return (
    <Box
      className="schemes-form"
      sx={{ display: "flex", flexDirection: "column", rowGap: "2.5rem" }}
    >
      <DBTInput
        dbt={dbtValue}
        setDbt={setDbtValue}
        mobile={mobile}
        handleMobile={setMobile}
        loading={loading}
        otpSuccess={otpSuccess}
        otpError={otpError}
        handleError={setOtpError}
        handleLoading={setLoading}
        handleSuccess={setOtpSuccess}
      />
      {mobile && (
        <OtpBox
          dbt={dbtValue}
          mobile={mobile}
          loading={loading}
          otpSuccess={otpSuccess}
          otpError={otpError}
          handleVerify={handleVerify}
          handleFarmerData={handleFarmerData}
          handleError={setOtpError}
          handleLoading={setLoading}
          handleSuccess={setOtpSuccess}
        />
      )}
    </Box>
  );
}

const DBTInput = ({
  dbt,
  setDbt,
  mobile,
  otpSuccess,
  otpError,
  loading,
  handleMobile,
  handleError,
  handleLoading,
  handleSuccess,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";

  const handleDbtChange = (event) => {
    handleMobile("");
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 13) {
      setDbt(value);
    }
  };
  const handleClick = async () => {
    if (dbt.length === 0) {
      dispatchNotification("error", ["EMPTY_DBT_ID"], dispatch);
      return;
    } else if (dbt.length < 13) {
      dispatchNotification("error", ["INVALID_DBT_ID"], dispatch);
      return;
    }

    handleLoading(true); // Set loading state to true
    handleError(false);
    handleSuccess(false);

    const requestData = {
      otp: {
        mobileNumber: null,
        dbtId: dbt,
        categoryType: "PROFILE_GET",
        userType: "CITIZEN",
        tenantId: "br",
      },
    };
    try {
      const response = await SchemeService.otpFarmerSchemeGet(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        const mobileNumber = response?.message; // Assumes the response contains the mobile number
        dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
        handleMobile(mobileNumber);
        handleSuccess(true); // OTP sent successfully
      } else {
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      handleError(true); // Set error state
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      handleLoading(false); // Reset loading state after the request completes
    }
  };
  return (
    <Box className="schemes-dbt-box">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleClick(); // trigger your existing logic
        }}
      >
        <Box className="flex flex-col gap-2">
          <Typography
            variant="subtitle2"
            className="font-semibold"
            color={theme.palette.text.primary}
          >
            {t("schemes.farmerDBTId")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <CssTextField
              value={dbt}
              onChange={handleDbtChange}
              disabled={mobile}
              sx={{
                minWidth: "300px",
                width: { xs: "100%", sm: "fit-content" },
              }}
              darkTheme={isDarkTheme}
            />
            {!mobile && (
              <CustomButton
                type="submit" // ✅ key change here
                state={loading ? ButtonState.DISABLED : ButtonState.ENABLED}
              >
                {loading ? t("schemes.sendingOTP") : t("schemes.getOTP")}
              </CustomButton>
            )}
          </Box>
          {loading && (
            <Typography color="primary" sx={{ marginTop: "8px" }}>
              {t("schemes.sendingOTP")}...
            </Typography>
          )}
          {otpSuccess && (
            <Typography
              color={theme.palette.text.textGreen}
              sx={{ marginTop: "8px" }}
            >
              {t("schemes.otpSuccess")}
            </Typography>
          )}
          {otpError && (
            <Typography color="red" sx={{ marginTop: "8px" }}>
              {t("schemes.otpFailed")}
            </Typography>
          )}
        </Box>
      </form>
    </Box>
  );
};

const OtpBox = ({
  dbt,
  mobile,
  handleVerify,
  handleFarmerData,
  handleError,
  handleLoading,
  handleSuccess,
}) => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme()
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setOtpValue("");
    setIsLoading(true);
    handleLoading(true);
    handleError(false);
    handleSuccess(false);
    try {
      const requestData = {
        otp: {
          mobileNumber: null,
          dbtId: dbt,
          categoryType: "PROFILE_GET",
          userType: "CITIZEN",
          tenantId: "br",
        },
      };
      const response = await SchemeService.otpFarmerSchemeGet(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        const mobileNumber = response?.message;
        dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
        setTimer(30);
        setCanResend(false);
        handleSuccess(true);
      } else {
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
      handleError(true);
    } finally {
      setOtpValue("");
      setIsLoading(false); // Reset loading state after the request completes
      handleLoading(false);
    }
  };

  const handleOTPClick = async () => {
    if (otpValue.length < 6) {
      dispatchNotification("error", ["INVALID_OTP"], dispatch);
      return;
    }

    setIsLoading(true);
    const requestData = {
      entitySearchRequest: {
        mobileNumber: null,
        dbtId: dbt,
        categoryType: "PROFILE_GET",
        userType: "CITIZEN",
        tenantId: "br",
        otp: otpValue,
      },
    };

    try {
      const response = await SchemeService.otpFarmerVerify(requestData);
      if (response?.ResponseInfo?.status === "successful") {
        handleVerify(true);
        handleFarmerData(response.proxyResponse);
      } else {
        setOtpValue("");
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Box className="schemes-dbt-box">
      <Typography variant="subtitle2" color={theme.palette.text.textGrey}>
        {t("schemes.otpSentMessage", { mobile: mobile })}
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleOTPClick(); // Trigger on form submit (Enter or button click)
        }}
      >
        <Box className="flex flex-col gap-2">
          <Typography
            variant="subtitle2"
            className="font-semibold"
            color={theme.palette.text.primary}
          >
            {t("schemes.enterOTP")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              columnGap: "2rem",
              rowGap: "1rem",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "start",
            }}
          >
            <Box>
              <OTPinput otp={otpValue} setOtp={setOtpValue} />{" "}
              <Box sx={{ mt: 2 }}>
                {canResend ? (
                  <Button
                    onClick={handleResendOtp}
                    sx={{
                      color: theme.palette.text.error,
                      p: 0,
                      minWidth: "auto",
                      textTransform: "none",
                      textDecoration: "underline",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      t("schemes.resendOtp")
                    )}
                  </Button>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.error,
                      textDecoration: "underline",
                    }}
                  >
                    {t("schemes.resendOtpIn", { seconds: timer })}
                  </Typography>
                )}
              </Box>
            </Box>
            <CustomButton
              type="submit" // ✅ Important change
              sx={{ maxWidth: "100px", margin: { xs: "auto", sm: "0" } }}
              state={isLoading ? ButtonState.DISABLED : ButtonState.ENABLED}
            >
              {isLoading ? <CircularProgress size={24} /> : t("schemes.verify")}
            </CustomButton>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default FarmerDBTInput;
