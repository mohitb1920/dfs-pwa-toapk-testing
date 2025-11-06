import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
  useTheme,
  Container,
  LinearProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import OTPinput from "../../components/OTPinput";
import PropTypes from "prop-types";

const ChangeNumOTPPopup = ({
  open,
  onClose,
  onResend,
  handleVerifyOTP,
  maskedMobileNumber,
  errorMessageOTPValidation,
  setErrorMessageOTPValidation,
  OTPResentMessage,
  otp,
  setOtp,
  setStepper,
  loading
}) => {

  const maskedMobile = maskedMobileNumber;

  const theme = useTheme();
  const handleClose = () => {
    setOtp("");
    setErrorMessageOTPValidation("");
    onClose();
    setStepper(0);
  };

  const [timeLeft, setTimeLeft] = useState(30);
  const [timer, setTimer] = useState(null);
  const [isResendVisible, setIsResendVisible] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) {
      startOtpTimer();
    }

    return () => {
      clearTimer();
    };
  }, [open]);

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  const startOtpTimer = () => {
    clearTimer();
    setTimeLeft(30);
    setIsResendVisible(false);

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          setIsResendVisible(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setTimer(timerId);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs">
      {loading && <LinearProgress color="success" />}
      <DialogContent className="!p-0">
        <Container variant="primary">
          <Box className="!px-3 !py-6 gap-6 flex flex-col items-center rounded-md">

            <img src="../../assets/accountCard.svg" alt="" style={{ height: "96px", borderRadius: "53px" }}/>

            <Box className="flex justify-center items-center">
              <Typography
                variant="body1"
                className="text-center"
                sx={{
                  color: theme.palette.text.textGrey,
                }}
              >
                {t("otp_sent_message_1",{maskedMobile})}{" "}
                {t("otp_sent_message_2")}
              </Typography>
            </Box>
            <OTPinput otp={otp} setOtp={setOtp} />
            <Button
              variant="primary"
              onClick={() => handleVerifyOTP()}
              disabled={otp?.length !== 6}
            >
              <Box className="items-center flex justify-center rounded-lg w-44 sm:w-72">
                {t("farmerRegistration.VERIFY")}
              </Box>
            </Button>

            {errorMessageOTPValidation && (
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.error,
                  textAlign: "left",
                }}
              >
                {errorMessageOTPValidation}
              </Typography>
            )}

            <Box className="flex justify-center items-center text-center gap-2 h-[20px] w-[300px]">
              {!isResendVisible ? (
                  <Typography variant="body1">
                    {t("farmerRegistration.DIDNOT_RECIEVE")}{" "}
                    <span style={{ textDecoration: "underline" }}>
                      {t("farmerRegistration.RETRY1")} {timeLeft}
                      {"s "}
                      {t("farmerRegistration.RETRY2")}
                    </span>
                  </Typography>
              ) : (
                <Button
                  onClick={() => {
                    onResend();
                    startOtpTimer();
                  }}
                  variant="textButtonBlack"
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "20px",
                  }}
                >
                  <span
                    style={{
                      textDecoration: "underline",
                      textTransform: "none",
                    }}
                  >
                    {t("farmerRegistration.RESEND_OTP")}
                  </span>
                </Button>
              )}
            </Box>
            {OTPResentMessage && (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "right",
                  marginTop: "10px",
                }}
              >
                {OTPResentMessage}
              </Typography>
            )}
          </Box>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeNumOTPPopup;

ChangeNumOTPPopup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onResend: PropTypes.func,
  handleVerifyOTP: PropTypes.func,
  maskedMobileNumber: PropTypes.string,
  errorMessageOTPValidation: PropTypes.string,
  OTPResentMessage: PropTypes.string,
  otp: PropTypes.string,
  setOtp: PropTypes.func,
  setStepper: PropTypes.func,
  loading: PropTypes.bool,
  setErrorMessageOTPValidation: PropTypes.func,
};
