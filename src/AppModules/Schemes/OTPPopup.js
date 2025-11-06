import { Dialog, DialogContent, Grid, Typography, Button } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useState, useEffect } from "react";
import LockIcon from "@mui/icons-material/Lock";
const OTPPopup = ({
  open,
  onClose,
  onResend,
  handleVerifyOTP,
  maskedMobileNumber,
}) => {
  const [otp, setOtp] = useState("");
  const handleChange = (newValue) => {
    setOtp(newValue);
  };
  const handleClose = () => {
    setOtp("");
    onClose();
  };
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendVisible, setIsResendVisible] = useState(false);
  useEffect(() => {
    let timer;
    if (open) {
      setTimeLeft(30);
      setIsResendVisible(false);
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsResendVisible(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(timer);
    };
  }, [open]);
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <Grid
          container
          item
          sx={{
            width: "440px",
            height: "489px",
            padding: "40px",
            gap: "24px",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <Grid
            item
            sx={{
              width: "80px",
              height: "80px",
              padding: "16px",
              gap: "20px",
              borderRadius: "200px",
              backgroundColor: "#D0F19E",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LockIcon
              sx={{
                width: "48px",
                height: "48px",
                color: "#1A5C4B",
              }}
            />
          </Grid>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "25px",
              letterSpacing: "-1px",
              textAlign: "center",
              color: "#1A5C4B",
              width: "271px",
              height: "25px",
            }}
          >
            Please Verify
          </Typography>
          <Grid
            container
            sx={{
              width: "360px",
              height: "44px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "22.4px",
                textAlign: "center",
                color: "#3D4541",
              }}
            >
              We have sent you a One-Time Password to your registered mobile
              number {maskedMobileNumber}.
            </Typography>
          </Grid>
          <MuiOtpInput
            value={otp}
            onChange={handleChange}
            length={6}
            sx={{
              "& input": {
                backgroundColor: "#F2F2F2",
                borderRadius: "10px",
                fontFamily: "Inter",
                fontWeight: 500,
                lineHeight: "25px",
                letterSpacing: "-1px",
                textAlign: "center",
              },
            }}
          />
          <Button onClick={() => handleVerifyOTP(otp)} sx={{ padding: 0 }}>
            <Grid
              container
              sx={{
                width: "360px",
                height: "57px",
                background: "#F7D508",
                borderRadius: "8px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "18px",
                  fontWeight: 500,
                  lineHeight: "18px",
                  textAlign: "center",
                  color: "#1C211E",
                  textTransform: "none",
                }}
              >
                Verify
              </Typography>
            </Grid>
          </Button>
          <Grid
            container
            sx={{
              width: "360px",
              height: "20px",
              gap: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {!isResendVisible ? (
              <>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "20px",
                    color: "#0A0D0B",
                  }}
                >
                  Didn’t receive?{" "}
                  <span style={{ textDecoration: "underline" }}>
                    Retry in {timeLeft}s
                  </span>
                </Typography>
              </>
            ) : (
              <Button
                onClick={() => onResend()}
                variant="contained"
                color="primary"
                style={{ marginTop: "10px" }}
              >
                Resend OTP
              </Button>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default OTPPopup;
