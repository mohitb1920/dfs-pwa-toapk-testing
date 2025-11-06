import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useWatch } from "react-hook-form";
import Mapper from "../Mapper";
import OTPinput from "../../OTPinput";
import CustomButton from "../../Button/CustomButton";
import { dispatchNotification } from "../../Utils";
import { SchemeService } from "../../../services/Schemes";
import { ButtonState } from "../../Button/ButtonEnums";

const MemberDetails = ({
  scheme,
  schemeName,
  language,
  methods,
  disableAll,
  schemeId,
  index,
}) => {
  const {
    register,
    control,
    reset,
    watch,
    trigger,
    setError,
    clearErrors,
    setValue,
    formState,
  } = methods;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false);
  const [shouldVerify, setShouldVerify] = useState(false);
  const [aadharAuthResponse, setAadharAuthResponse] = useState([]);

  const groupDetailsWatch = useWatch({
    control,
    name: "familyDetails.memberDetails",
  });
  const aadharNumber = groupDetailsWatch?.[index]?.["memberAadhaarNumber"];
  const memberStatus = groupDetailsWatch?.[index]?.["memberStatus"];
  const memberName = groupDetailsWatch?.[index]?.["memberNameKrishi"];
  const isVerified = groupDetailsWatch?.[index]?.["verified"];

  useEffect(() => {
    if (disableAll) return;
    if (
      formState.isSubmitted &&
      groupDetailsWatch?.length &&
      !groupDetailsWatch[groupDetailsWatch.length - 1]?.verified
    ) {
      setError("familyDetails", {
        type: "manual",
        message: t("schemeErrors.addNewRowPreviewError"),
      });
    } else {
      clearErrors("familyDetails");
    }
  }, [groupDetailsWatch, formState.isSubmitted, setError, clearErrors, t]);

  useEffect(() => {
    // Reset shouldVerify when any form field in groupDetailsWatch changes
    if (shouldVerify) {
      setShouldVerify(false);
    }
  }, [groupDetailsWatch]);

  const handleVerify = async () => {
    setIsLoading(true);
    setShouldVerify(false);
    const isValid = await trigger("familyDetails.memberDetails");

    if (!isValid) return setIsLoading(false);

    setShouldVerify(true);
    if (aadharNumber?.length === 12 && memberStatus?.valueEnglish === "Alive") {
      try {
        const response = await SchemeService.aadharAuth(
          schemeId,
          encodeURIComponent(memberName?.toUpperCase()),
          aadharNumber
        );
        setAadharAuthResponse(response);
        dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
      } catch (error) {
        setShouldVerify(false);
        dispatchNotification("error", [error.message], dispatch);
      } finally {
        setIsLoading(false);
      }
    } else if (memberStatus?.value === "Dead") {
      setValue(`${schemeName}[${index}].verified`, true);
      setShouldVerify(false);
      setIsLoading(false);
    }
  };

  const getWidthStyles = (type) => {
    return ["string", "date", "label"].includes(type)
      ? "w-full md:w-[calc(50%-8px)] lg:w-[calc(33.3333%-10.667px)]"
      : "w-full";
  };

  const isOtpBoxOpen =
    !isLoading &&
    shouldVerify &&
    memberStatus.value === "Alive" &&
    aadharAuthResponse?.[0]?.auth === "SUCCESS";

  return (
    <Box className="flex flex-col gap-6">
      <Box className="flex flex-wrap gap-y-8 gap-x-4">
        {Object.entries(scheme.properties).map(([fieldKey, fields]) => {
          const { type } = fields;
          const widthStyles = getWidthStyles(type);
          return (
            <Box key={fieldKey} className={widthStyles}>
              <Box sx={{ height: "100%" }}>
                <Mapper
                  methods={methods}
                  parent={schemeName + `[${index}]`}
                  relation={fieldKey}
                  schemeId={schemeId}
                  type={type}
                  obj={fields}
                  register={register}
                  language={language}
                  control={control}
                  watch={watch}
                  reset={reset}
                  disableAll={
                    disableAll || isVerified || isLoading || isOtpBoxOpen
                  }
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Display loading indicator */}
      {isLoading && (
        <Typography variant="body1" color="#F7D508">
          {t("COMMON_LOADING")}
        </Typography>
      )}

      {/* Submit Button */}
      {!shouldVerify && !isLoading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <CustomButton
            disabled={disableAll}
            state={
              disableAll || isVerified
                ? ButtonState.DISABLED
                : ButtonState.ENABLED
            }
            onClick={handleVerify}
          >
            {t("schemes.submit")}
          </CustomButton>
        </Box>
      )}

      {/* Display OTP box or mismatch message only after loading completes */}
      {!isLoading &&
        shouldVerify &&
        memberStatus.value === "Alive" &&
        (aadharAuthResponse?.[0]?.auth === "SUCCESS" ? (
          <OTPAadhar
            name={memberName}
            aadharNo={aadharNumber}
            schemeId={schemeId}
            schemeName={schemeName}
            index={index}
            methods={methods}
            setShouldVerify={setShouldVerify}
          />
        ) : (
          <Typography variant="body1" color={theme.palette.text.error}>
            {!aadharAuthResponse?.length
              ? t("enterValidDetails")
              : "Please try again after some time."}
          </Typography>
        ))}
    </Box>
  );
};

const OTPAadhar = ({
  name,
  aadharNo,
  schemeId,
  schemeName,
  index,
  methods,
  setShouldVerify,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setOtpValue("");
    setIsLoading(true);
    try {
      const response = await SchemeService.aadharAuth(schemeId, name, aadharNo);
      if (response?.[0]?.auth === "SUCCESS") {
        dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
        setTimer(30);
        setCanResend(false);
      } else {
        throw new Error(["Please try again letter"], "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPClick = async () => {
    if (otpValue.length < 6) {
      dispatchNotification("error", ["INVALID_OTP"], dispatch);
      return;
    }

    setIsLoading(true);
    try {
      const response = await SchemeService.aadharOTP(
        schemeId,
        aadharNo,
        otpValue
      );
      if (response?.[0]?.auth === "SUCCESS") {
        methods.setValue(`${schemeName}[${index}].verified`, true);
      } else if (response?.[0]?.auth === "400") {
        throw new Error(["INVALID_OTP"], "SOMETHING_WENT_WRONG");
      } else {
        throw new Error(["Please try again later"], "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      setOtpValue("");
      setIsLoading(false);
    }
  };

  return (
    <Box className="schemes-form">
      <Box className="schemes-dbt-box">
        <Typography variant="subtitle2" color={theme.palette.text.textGrey}>
          {t("schemes.memberOtpSentMessage")}
        </Typography>
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
              onClick={handleOTPClick}
              sx={{ maxWidth: "100px", margin: { xs: "auto", sm: "0" } }}
              state={isLoading ? ButtonState.DISABLED : ButtonState.ENABLED}
            >
              {isLoading ? <CircularProgress size={24} /> : t("schemes.verify")}
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default MemberDetails;
