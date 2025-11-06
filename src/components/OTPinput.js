import React, { useRef } from "react";
import OTPInput from "react-otp-input";
import "../styles/Signup.css";

function OTPinput({ otp, setOtp, setSubmissionStatus = () => {} }) {
  const inputRefs = useRef([]);

  const handleChange = (otp) => {
    if (/^\d*$/.test(otp) && otp.length <= 6) {
      setOtp(otp);
      setSubmissionStatus({
        message: "",
        success: false,
        submitted: false,
      });
      const currentInputIndex = otp.length;
      if (currentInputIndex < inputRefs.current.length) {
        inputRefs.current[currentInputIndex].focus();
      }
    }
  };
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index]) {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  const customRenderInput = (props, index) => (
    <input
      {...props}
      ref={(el) => (inputRefs.current[index] = el)}
      onKeyDown={(e) => handleKeyDown(e, index)}
      autoFocus={index === 0}
    />
  );

  return (
    <OTPInput
      value={otp}
      onChange={handleChange}
      numInputs={6}
      containerStyle={{
        justifyContent: "center",
      }}
      shouldAutoFocus={true}
      inputStyle={"grm-otp-input-box"}
      renderSeparator={<span>&nbsp;</span>}
      renderInput={(props, index) => customRenderInput(props, index)}
    />
  );
}

export default OTPinput;
