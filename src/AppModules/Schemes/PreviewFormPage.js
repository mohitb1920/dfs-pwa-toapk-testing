import React, { useEffect, useState } from "react";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import { getCurrentLanguage, mainextractSchemas, dispatchNotification } from "../../components/Utils";
import FormComponent from "./FormComponent";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SchemeService } from "../../services/Schemes";
import { useTranslation } from "react-i18next";
import MappingBackend from "./Mapping/MappingBackend";
import OTPinput from "../../components/OTPinput";
import { useDispatch } from "react-redux";
import SubmitScreen from "../SubmitScreen";
import CustomButton from "../../components/Button/CustomButton";
import { ButtonColor, ButtonState } from "../../components/Button/ButtonEnums";
import FormFields from "./FormFields";
import SchemeTrackComponent from "../../components/SchemeTrackComponent";
import applyScheme from "./Mapping/submitScheme";

function PreviewFormPage(props) {
  const { mainSchemeId, schemeId, methods, handleBackClick } = props;
  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  let { 
    data: schemeData,
    isLoading,
    refetch,
  } = useSpecificSchemeData(schemeId);
  function getIdentifierValue(identifiers, type) {
    const identifier = identifiers.find((id) => id.identifierType === type);
    return identifier ? identifier.identifierId : null;
  }
  const selectedScheme =
    schemeData && schemeData[schemeId] ? schemeData[schemeId]?.[0] : {};
  const schemeff = mainextractSchemas(selectedScheme?.formFields);
  const selectedSource = methods.watch("applicationType", "");
  const dbt = getIdentifierValue(
    methods.getValues()?.farmerData?.Individual?.identifiers,
    "DBTID"
  );
  const steps = [];

  const schemeff2 = mainextractSchemas(
    selectedScheme?.formFields2,
    selectedSource,
    steps
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [ipAddress, setIpAddress] = useState("");

  useEffect(() => {
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
      .catch((error) => console.error("Error fetching IP:", error));
  }, []);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalState, setModalState] = useState("closed");
  const [mobile, setMobile] = useState(null);
  const [applicationId, setApplicationId] = useState({});
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);
  const [isCitizenSubmitting, setIsCitizenSubmitting] = useState(false);

  const createSchemePayload = () => {
    methods.setValue(
      "schemeName",
      t(
        selectedScheme["schemeName"]["title-en"] ||
          selectedScheme["schemeName"]["title"]
      )
    );
    methods.setValue("ipAddress", ipAddress);
    return MappingBackend(
      methods.getValues(),
      mainSchemeId,
      schemeId
    );
  }

  const handleSubmitByFarmer = async () => {
    setIsCitizenSubmitting(true);
    const schemePayload = createSchemePayload();
    const requestData = {
      RequestInfo: {
        apiId: "asset-services",
        ver: null,
        ts: null,
        action: null,
        did: null,
        key: null,
        requesterId: null,
        msgId: "search with from and to values",
        authToken: localStorage.getItem("DfsWeb.access-token"),
        userInfo: {
          uuid: localStorage.getItem("DfsWeb.user-info") && JSON.parse(localStorage.getItem("DfsWeb.user-info")).uuid,
          roles: [{ code: "SMALL_SCALE_PRODUCER", tenantId: "br" }],
          type: "EMPLOYEE",
        },
      },
      dfsSchemeApplication: schemePayload?.dfsSchemeApplication
    };

    try {
      const response = await applyScheme(requestData);

      if (response?.status === 200) {
        setApplicationId({
          dfsSchemeApplicationId:
            response.data?.dfsSchemeApplication?.dfsSchemeApplicationId,
          status:
            response.data?.dfsSchemeApplication?.status,
          time: response.data?.dfsSchemeApplication?.auditDetails?.createdTime,
        });
        setModalState("success");
      } else {
        if (response?.Errors?.[0]?.code === "SCHEME_APPLICATION_CREATE_ERROR")
          setModalState("closed");
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      let errorMessage;

      if (error.message && error.message !== "SOMETHING_WENT_WRONG") {
        errorMessage = t(error.message, { defaultValue: null });
        if (errorMessage === null || errorMessage === error.message) {
          errorMessage = t("SOMETHING_WENT_WRONG");
        }
      } else {
        errorMessage = t("SOMETHING_WENT_WRONG");
      }

      dispatchNotification("error", [errorMessage], dispatch);
    }finally {
      setIsCitizenSubmitting(false);
    }
  };

  const handleSubmitByAgent = async () => {
    setIsSubmittingOTP(true);
    try {
      const requestData = {
        otp: {
          mobileNumber: null,
          dbtId: dbt,
          categoryType: "SCHEME_APPLY",
          userType: "CITIZEN",
          tenantId: "br",
          additionalFields: {
            schemeName: selectedScheme["schemeName"]["title-en"],
          },
        },
      };

      const response = await SchemeService.otpFarmerSchemeGet(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        setModalState("otp");
        const mobileNumber = response?.message;
        setMobile(mobileNumber);
      } else {
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      setIsSubmittingOTP(false);
    }
  };

  const handleOTPSubmit = async (otp) => {
    setIsSubmittingOTP(true);
    const schemePayload = createSchemePayload();

    const requestData = {
      proxyRequest: {
        mobileNumber: null,
        dbtId: dbt,
        categoryType: "SCHEME_APPLY",
        userType: "CITIZEN",
        tenantId: "br",
        otp: otp,
        payload: schemePayload,
      },
    };
    try {
      const response = await SchemeService.schemeSubmit(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        setApplicationId({
          dfsSchemeApplicationId:
            response.proxyResponse?.dfsSchemeApplicationId,
          status: response.proxyResponse?.status,
          time: response.proxyResponse?.auditDetails?.createdTime,
        });
        setModalState("success");
      } else {
        if (response?.Errors?.[0]?.code === "SCHEME_APPLICATION_CREATE_ERROR")
          setModalState("closed");
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      let errorMessage;

      if (error.message && error.message !== "SOMETHING_WENT_WRONG") {
        errorMessage = t(error.message, { defaultValue: null });
        if (errorMessage === null || errorMessage === error.message) {
          errorMessage = t("SOMETHING_WENT_WRONG");
        }
      } else {
        errorMessage = t("SOMETHING_WENT_WRONG");
      }

      dispatchNotification("error", [errorMessage], dispatch);
    } finally {
      setIsSubmittingOTP(false);
    }
  };

  const handleSubmitClick = () => {
    if (!ipAddress) {
      dispatchNotification("error", ["IP_ADDRESS_ERROR"], dispatch);
      return;
    }
    if(localStorage.getItem("DfsWeb.isCitizenUser") === "true"){
      handleSubmitByFarmer();
    }
    else{
      handleSubmitByAgent();
    }
  };

  const handleModalClose = () => {
    setModalState("submit");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handlePreviousClick = () => {
    handleBackClick(false);
  };

  const handleDownload = async () => {
    try {
      const data = {
        RequestInfo: {
          ts: 0,
          action: "string",
          did: "string",
          key: "string",
          msgId: "string",
          requesterId: "string",
        },
      };
      const response = await SchemeService.schemeReceipt(
        data,
        applicationId?.dfsSchemeApplicationId
      );
      if (response) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `scheme_receipt_${applicationId?.dfsSchemeApplicationId}.pdf`; // Customize file name
        link.click(); // Trigger download

        // Clean up
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        throw new Error(
          response?.data?.Errors?.[0]?.code || "File Not Downloaded"
        );
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    }
  };

  const getDetailsIcons = (title) => {
    switch (title) {
      case "Personal_Information":
        return "/assets/personalDetails.svg";
      case "Location_Information":
        return "/assets/locationInfo.svg";
      case "Bank_Details":
        return "/assets/bankDetails.svg";
    }
  };

  function updatePropertiesToTextPreview(obj) {
    // Check if the object has a "properties" field
    if (obj && obj.properties) {
      // Iterate through each property
      Object.keys(obj.properties).forEach((key) => {
        // Update the "type" to "textPreview" if it's currently "string"
        if (obj.properties[key].type === "string") {
          obj.properties[key].type = "textPreview";
        }
      });
    }

    // Return the updated object
    return obj;
  }

  const formData = methods.getValues();
  formData.farmerData = undefined;
  formData.mainSchemeId = undefined;
  formData.schemeName = undefined;
  formData.ipAddress = undefined;
  return (
    <>
      {modalState === "submit" && (
        <SchemeTrackComponent
          schemeApplicationId={applicationId?.dfsSchemeApplicationId}
          applicationStatus={applicationId?.status}
          applicationNumber={applicationId?.dfsSchemeApplicationId}
          applicationDate={applicationId?.time}
          handleDownloadClick={handleDownload}
          t={t}
        />
      )}
      {schemeff && schemeff.properties && (
        <Box className="scheme-details-input-box">
          <Box className="schemes-form">
            <FormComponent
              scheme={schemeff}
              language={language}
              schemeId={schemeId}
              methods={methods}
              disableAll={true}
            />
          </Box>
        </Box>
      )}
      <Box
        className="schemes-form rounded-[12px]"
        bgcolor={
          isDarkTheme
            ? theme.palette.background.tertiaryGreen
            : theme.palette.background.default
        }
        sx={{
          boxShadow: isDarkTheme
            ? "0px 4px 20px rgba(255, 255, 255, 0.1)"
            : "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {Object.entries(schemeff2).map(([key, property]) => {
          if (
            [
              "Personal_Information",
              "Location_Information",
              "Bank_Details",
            ].includes(property.title)
          ) {
            const updatedData = updatePropertiesToTextPreview(
              JSON.parse(JSON.stringify(property))
            );
            return (
              <Box className="scheme-form-preview-box">
                <Box className="flex gap-2">
                  <Box className="flex justify-center items-center">
                    <img
                      src={`${window.contextPath}${getDetailsIcons(
                        updatedData.title
                      )}`}
                      alt={t(updatedData[`title`])}
                      className="w-8 h-8"
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    className="scheme-form-component-title !font-semibold"
                    color={theme.palette.text.primary}
                  >
                    {t(updatedData[`title`])}
                  </Typography>
                </Box>
                <FormFields
                  language={i18n.language === "hi_IN" ? "hi" : "en"}
                  key={key}
                  {...props}
                  scheme={updatedData}
                  schemeName={steps[key]}
                  disableAll={true}
                />
              </Box>
            );
          }
          return null; // Skip rendering if the condition is not met
        })}
      </Box>

      <Box className="scheme-details-input-box">
        <Box className="schemes-form">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "2.5rem",
            }}
          >
            {Object.entries(schemeff2).map(([key, property]) => {
              if (
                ![
                  "Personal_Information",
                  "Location_Information",
                  "Bank_Details",
                ].includes(property.title)
              ) {
                const updatedData = JSON.parse(JSON.stringify(property));
                if (["Documents_to_be_uploaded"].includes(property.title)) {
                  updatedData.title = "schemes.documentPreview";
                }
                return (
                  <FormComponent
                    key={key}
                    {...props}
                    scheme={updatedData}
                    schemeName={steps[key]}
                    disableAll={true}
                  />
                );
              }
              return null; // Skip rendering if the condition is met
            })}
            {modalState === "otp" && (
              <OtpBox
                mobile={mobile}
                handleSubmitOTP={handleOTPSubmit}
                dbt={dbt}
                handleMobile={setMobile}
                isSubmittingOTP={isSubmittingOTP}
                selectedScheme={selectedScheme}
              />
            )}
            {modalState === "success" && (
              <SubmitScreen
                handleModalClose={handleModalClose}
                applicationId={applicationId}
                schemeName={t(
                  selectedScheme["schemeName"]["title-en"] ||
                    selectedScheme["schemeName"]["title"]
                )}
              />
            )}
            {/* {modalState === "submit" && (
              <FormPreview
                applicationData={applicationId}
                formData={formData}
                handleDownload={handleDownload}
                schemeData={selectedScheme}
              />
            )} */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              {modalState !== "submit" && modalState !== "otp" ? (
                <CustomButton
                  color={ButtonColor.SECONDARY}
                  state={
                    isSubmittingOTP ? ButtonState.DISABLED : ButtonState.ENABLED
                  }
                  onClick={handlePreviousClick}
                >
                  {t("schemes.previous")}
                </CustomButton>
              ) : (
                <Box></Box>
              )}
              {modalState !== "submit" && modalState !== "otp" ? (
                <CustomButton
                  state={
                    (isSubmittingOTP || isCitizenSubmitting) ? ButtonState.DISABLED : ButtonState.ENABLED
                  }
                  onClick={handleSubmitClick}
                >
                  {isSubmittingOTP
                    ? t("schemes.sendingOTP")
                    : t("schemes.submitApplication")}
                </CustomButton>
              ) : (
                modalState !== "otp" && (
                  <CustomButton
                    onClick={() => navigate(`${window.contextPath}/home`)}
                  >
                    {t("schemes.homePage")}
                  </CustomButton>
                )
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const OtpBox = ({
  dbt,
  mobile,
  handleSubmitOTP,
  handleOTPError,
  handleMobile,
  isSubmittingOTP,
  selectedScheme,
}) => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();

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
    try {
      const requestData = {
        otp: {
          mobileNumber: null,
          dbtId: dbt,
          categoryType: "SCHEME_APPLY",
          userType: "CITIZEN",
          tenantId: "br",
          additionalFields: {
            schemeName: selectedScheme["schemeName"]["title-en"],
          },
        },
      };
      const response = await SchemeService.otpFarmerSchemeGet(requestData);

      if (response?.ResponseInfo?.status === "successful") {
        const mobileNumber = response?.message;
        setTimer(30);
        setCanResend(false);
        handleMobile(mobileNumber);
        dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
      } else {
        throw new Error(response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG");
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    } finally {
      setIsLoading(false); // Reset loading state after the request completes
    }
  };

  const handleOTPClick = async () => {
    if (otpValue.length < 6) {
      dispatchNotification("error", ["INVALID_OTP"], dispatch);
      return;
    }
    await handleSubmitOTP(otpValue);
    setOtpValue("");
  };
  return (
    <Box className="schemes-form">
      <Box className="schemes-dbt-box">
        <Typography variant="subtitle2" color={theme.palette.text.textGrey}>
          {t("schemes.otpSentMessage", { mobile: mobile })}
        </Typography>
        <Box className="flex flex-col gap-2">
          <Typography
            variant="subtitle2"
            className="font-semibold"
            color={theme.palette.text.primary}
          >
            {t("schemes.enterOTP")}
          </Typography>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleOTPClick();
          }}>
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
                type="submit"
                sx={{ maxWidth: "100px", margin: { xs: "auto", sm: "0" } }}
                state={
                  isSubmittingOTP ? ButtonState.DISABLED : ButtonState.ENABLED
                }
              >
                {isSubmittingOTP ? (
                  <CircularProgress size={24} />
                ) : (
                  t("schemes.verify")
                )}
              </CustomButton>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};
export default PreviewFormPage;
