import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OTPinput from "../../components/OTPinput";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import animationData from "../../animations/FileAnimation.json";
import Lottie from "lottie-react";

function VerifyOtpModal(props) {
  const {
    open,
    handleClose,
    handleSubmit,
    otp,
    setOtp,
    waitTime,
    setWaitTime,
    onSendOtp,
    otpSuccess,
    mobileNumber,
    loading,
    submissionStatus,
    setSubmissionStatus,
    otpError,
  } = props;
  const { t, i18n } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
      if (timeLeft === 0) {
        setWaitTime(null);
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  useEffect(() => {
    setTimeLeft(waitTime);
  }, [waitTime]);

  return (
    <Dialog
      open={open}
      aria-labelledby="verify-otp-modal"
      aria-describedby="verification-using-mobile-otp"
      fullWidth
      maxWidth="sm"
    >
      <CloseIcon
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 6,
          top: 6,
          cursor: "pointer",
          color: (theme) => theme.palette.grey[500],
        }}
      />
      {loading ? (
        <Box className="flex items-center justify-center h-72">
          <CircularProgress color="success" />
        </Box>
      ) : (
        <>
          {!submissionStatus.success && (
            <DialogTitle id="alert-dialog-title" mt={2}>
              <Box className="support-verify-otp-header">{t("VERIFY_OTP")}</Box>
            </DialogTitle>
          )}
          <DialogContent>
            {submissionStatus.success ? (
              <Box className="flex flex-col justify-center items-center">
                <Lottie
                  animationData={animationData}
                  style={{ width: 110, height: 110 }}
                />
                <Box
                  className="flex flex-col items-center justify-center mt-1"
                  data-testid="ticket-details"
                >
                  <Typography>{t(submissionStatus.message)}</Typography>
                  {submissionStatus.success && (
                    <Typography mt={1}>
                      {t("SUPPORT_TICKET_NUMBER")}:
                      <span className="font-bold ml-2">
                        {submissionStatus.response?.service?.serviceRequestId}
                      </span>
                    </Typography>
                  )}
                </Box>
              </Box>
            ) : (
              <>
                <Typography className="support-enter-mobile-header">
                  {t("PLEASE_ENTER_OTP_SENT_ON")}{" "}
                  {"******" + mobileNumber?.slice(-4)} {t("OTP_SENT_SUFFIX")}
                </Typography>
                <OTPinput
                  otp={otp}
                  setOtp={setOtp}
                  setSubmissionStatus={setSubmissionStatus}
                />
                <Box className="mb-1 mt-3">
                  {timeLeft > 0 ? (
                    <Typography
                      className="time-left justify-content"
                      variant="caption"
                    >
                      {i18n.language === "en_IN"
                        ? `${t("COMMON_RESEND_ANOTHER_OTP")} ${timeLeft} secs`
                        : `${timeLeft} ${t("COMMON_RESEND_ANOTHER_OTP")}`}{" "}
                    </Typography>
                  ) : (
                    <Typography
                      className="send-otp justify-content"
                      onClick={onSendOtp}
                    >
                      {t("COMMON_RESEND_OTP")}
                    </Typography>
                  )}
                </Box>
                {otpSuccess && timeLeft > 25 && (
                  <Typography
                    variant="caption"
                    color="green"
                    className="justify-content"
                  >
                    {t("COMMON_OTP_SENT_SUCCESSFULLY")}
                  </Typography>
                )}
                {otpError && (
                  <Box className="text-center text-secondary">
                    {t(otpError)}
                  </Box>
                )}
                {submissionStatus.submitted && !submissionStatus.success && (
                  <Box className="text-center text-secondary">
                    {t(submissionStatus.message)}
                  </Box>
                )}
              </>
            )}
            <Box className="flex justify-center mt-5">
              <Button
                variant="contained"
                onClick={
                  submissionStatus.success
                    ? handleClose
                    : () => handleSubmit(mobileNumber)
                }
                className="support-action-button"
                sx={{ width: "50% !important" }}
                disabled={loading || !otpSuccess || otp?.length < 6}
              >
                {t(
                  submissionStatus.success
                    ? "COMMON_DONE"
                    : "TECH_COMMON_SUBMIT"
                )}
              </Button>
            </Box>
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}

export default VerifyOtpModal;
