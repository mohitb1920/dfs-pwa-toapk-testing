import React, { useState, useEffect } from "react";
import { Typography, Button } from "@mui/material";
const OTPResend = ({ otp, updateOtp }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(5);

  function resendOTP() {
    setMinutes(0);
    setSeconds(20);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);
  return (
    <div>
      {seconds > 0 || minutes > 0 ? (
        <Typography sx={{ fontSize: "0.8rem", marginBottom: "0.35rem" }}>
          Resend OTP in{" "}
          <span style={{ fontWeight: "600" }}>
            {minutes < 10 ? `0${minutes}` : minutes} :{" "}
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </Typography>
      ) : (
        <Button
          disabled={seconds > 0 || minutes > 0}
          sx={{ color: "#FF5630", textTransform: "none", padding: "0" }}
          onClick={resendOTP}
        >
          Resend OTP
        </Button>
      )}
    </div>
  );
};

export default OTPResend;
