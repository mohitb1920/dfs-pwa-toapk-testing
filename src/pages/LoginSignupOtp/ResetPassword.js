import {
  Box,
  Button,
  Container,
  FormControl,
  InputAdornment,
  LinearProgress,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PasswordForm from "./PasswordForm";
import { CustomTextField } from "../Announcements/AnnouncementConfigurator";
import OTPinput from "../../components/OTPinput";
import { TENANT_ID, dispatchNotification } from "../../components/Utils";
import { changePassword, sendOtp } from "../../services/loginService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { customExceptions } from "../../constants";
import { useTranslation } from "react-i18next";
export const ColorButton = styled(Button)(() => ({
  fontSize: "20px",
  fontWeight: "700",
  textTransform: "none",
  lineHeight: "1.85",
  padding: "0px 9px",
  borderRadius: "10px",
  color: "#fff",
  backgroundColor: "#004d26",
  "&:hover": {
    backgroundColor: "darkgreen",
    color: "#fff",
  },
}));
function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobileNumber, setMobileNuber] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const tenantId = TENANT_ID;

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
      if (timeLeft === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const onSendOtp = async () => {
    if (mobileNumber.length < 10) {
      setErrors({ ...errors, mobile: true });
      return;
    }
    setLoading(true);
    const requestData = {
      otp: {
        mobileNumber,
        userType: "EMPLOYEE",
        type: "passwordreset",
        tenantId,
      },
    };
    const response = await sendOtp(requestData);
    if (response?.data?.isSuccessful) {
      setOtp("");
      setOtpSuccess(true);
      setTimeLeft(30);
    } else {
      const { data } = response;
      dispatchNotification(
        "error",
        [
          t(customExceptions[data?.error?.fields?.[0]?.code]) ||
            data?.error?.fields?.[0]?.message ||
            "SOMETHING_WENT_WRONG",
        ],
        dispatch
      );
    }
    setLoading(false);
  };

  const handleMobileInput = (event) => {
    const { value } = event.target;
    if (value.match(/\D/)) {
      event.preventDefault();
      return;
    }
    if (errors?.mobile) {
      setErrors({ ...errors, mobile: false });
    }
    setMobileNuber(value);
  };

  const handleUsernameInput = (value) => {
    if (errors?.username) {
      setErrors({ ...errors, username: false });
    }
    setUsername(value);
  };

  const enableSubmit = () => {
    if (!username) return true;
    if (
      !newPassword ||
      !confirmPassword ||
      errors.newPassword !== null ||
      errors.confirmPassword !== null
    )
      return true;
    if (otp.length < 6) return true;

    return false;
  };

  const onSubmit = async () => {
    setLoading(true);
    const requestData = {
      confirmPassword,
      newPassword,
      otpReference: otp,
      tenantId,
      type: "EMPLOYEE",
      userName: username.trim(),
    };

    const response = await changePassword(requestData, true);
    if (response?.status === 200) {
      dispatchNotification(
        "success",
        ["COMMON_PASSWORD_UPDATE_SUCCESS"],
        dispatch
      );
      setUsername("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setErrors({});
      navigate(`${window?.contextPath}/login`);
    } else {
      const { data } = response;
      if (data?.error?.fields?.[0]?.code === "OTP.VALIDATION_UNSUCCESSFUL") {
        setOtp("");
      }
      dispatchNotification(
        "error",
        [
          customExceptions[data?.Errors?.[0]?.code] ||
            customExceptions[data?.error?.fields?.[0]?.code] ||
            "SOMETHING_WENT_WRONG",
        ],
        dispatch
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem("DfsWeb.isLoggedIn") === "true") {
      navigate(`${window.contextPath}/home`);
    }
  }, []);

  return (
    <Box className="signup-container reset-width">
      <Container variant="white" className="!p-0 !rounded-3xl">
        <Box className="reset-container">
          {loading && <LinearProgress color="success" />}
          <Box className="reset-password-header-container justify-content">
            <Typography variant="h5" className="reset-password-header">
              {t("COMMON_RESET_PASSWORD")}
            </Typography>
          </Box>

          <form noValidate autoComplete="off">
            <FormControl sx={{ width: "100%" }}>
              <Typography className="add-field-label">
                {t("COMMON_USERNAME")} *
              </Typography>
              <CustomTextField
                size="small"
                fullWidth
                value={username}
                onChange={(e) => handleUsernameInput(e.target.value)}
                error={errors?.username}
                inputProps={{
                  "data-testid": "username-input",
                }}
                helperText={
                  errors?.username ? `${t("COMMON_USERNAME_ERROR")}` : ""
                }
              />
            </FormControl>
          </form>
          <PasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            errors={errors}
            setErrors={setErrors}
            forgotPassword={true}
          />
          <Box className="reset-mobile-number">
            <Typography variant="h7">{t("COMMON_PHONE_INFO_TEXT")}</Typography>
          </Box>
          <FormControl sx={{ width: "100%" }}>
            <CustomTextField
              size="small"
              fullWidth
              inputProps={{
                maxLength: 10,
                "data-testid": "mobile-input",
              }}
              InputProps={{
                maxLength: 10,
                startAdornment: (
                  <InputAdornment position="start">+91</InputAdornment>
                ),
              }}
              value={mobileNumber}
              onChange={(e) => handleMobileInput(e)}
              error={errors?.mobile}
              helperText={
                errors?.mobile ? `${t("COMMON_MOBILE_VALIDATION_ERROR")}` : ""
              }
            />
            {otpSuccess && timeLeft > 0 && (
              <Typography
                variant="caption"
                color="green"
                className="justify-content"
              >
                {t("COMMON_OTP_SENT_SUCCESSFULLY")}
              </Typography>
            )}
          </FormControl>
          {otpSuccess && <OTPinput otp={otp} setOtp={setOtp} />}
          <Box className="mb-1 justify-content">
            {timeLeft === null ? (
              <Button size="small" className="send-otp" onClick={onSendOtp}>
                {t("COMMON_SEND_OTP")}
              </Button>
            ) : timeLeft > 0 ? (
              <Typography
                className="time-left justify-content"
                variant="caption"
              >
                {i18n.language === "en_IN"
                  ? `${t("COMMON_RESEND_ANOTHER_OTP")} ${timeLeft} secs`
                  : `${timeLeft} ${t("COMMON_RESEND_ANOTHER_OTP")}`}{" "}
              </Typography>
            ) : (
              <Button size="small" className="send-otp" onClick={onSendOtp}>
                {t("COMMON_RESEND_OTP")}
              </Button>
            )}
            {/* {!error && <CardLabelError>{t("CS_INVALID_OTP")}</CardLabelError>} */}
          </Box>
          <div className="justify-content mt-5 mb-2">
            <Button
              variant="primary"
              id="submitButton"
              type="submit"
              fullWidth
              onClick={onSubmit}
              disabled={enableSubmit()}
            >
              {t("COMMON_CHANGE_PASSWORD")}
            </Button>
          </div>
        </Box>
      </Container>
    </Box>
  );
}

export default ResetPassword;
