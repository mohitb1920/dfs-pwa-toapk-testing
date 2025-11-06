import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import { CustomDropdown } from "../../PGR/ComplaintsInbox";
import { CustomTextField } from "../../../pages/Announcements/AnnouncementConfigurator";
import CustomButton from "../../../components/Button/CustomButton";
import { ButtonColor } from "../../../components/Button/ButtonEnums";
import { OtpInputRenderer } from "../../../components/FarmerDbtVerification";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SchemeService } from "../../../services/Schemes";
import { validateFarmerOtp } from "../../../services/AgentService";
import {
  dispatchNotification,
  getCurrentLanguage,
  TENANT_ID,
} from "../../../components/Utils";
import { useLocalizationStore } from "../../../Hooks/Store";
import SchemesTrack from "../../SchemesTrack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function TrackService({ isMobile }) {
  const { t } = useTranslation();
  const [service, setService] = useState(null);
  const [ticketId, setTicketId] = useState("");
  const [otpValidationError, setOtpValidationError] = useState({
    message: "",
  });
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState(null);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({});
  const [verificationLoading, setVerificationLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const trackServices = [
    { title: "agentTrack.TRACK_GRM", value: "GRM" },
    { title: "agentTrack.TRACK_SCHEME", value: "SCHEME" },
  ];

  const stateCode = TENANT_ID;
  const moduleCode = "agent-grm-track";
  const language = getCurrentLanguage();

  const { isLoading } = useLocalizationStore({
    stateCode,
    moduleCode,
    language,
  });

  const handleServiceChange = (value) => {
    if (value?.value !== service?.value) {
      setTicketId("");
    }
    if (otpValidationError?.notFound) {
      setOtpValidationError({ message: "" });
    }
    setErrors({});
    setService(value);
  };

  const handleInputChange = (e) => {
    if (errors.hasOwnProperty("ticketId")) {
      const newErrors = { ...errors };
      delete newErrors["ticketId"];
      setErrors(newErrors);
    }
    const trimmedValue = e.target.value.trim();
    setTicketId(trimmedValue);
  };

  const handleOtpSend = async () => {
    const validationErrors = {};
    if (ticketId.length < 20) {
      validationErrors.ticketId = "agentTrack.TICKET_VALIDATION_ERROR";
    }
    if (service === null) {
      validationErrors.service = "agentTrack.SERVICE_VALIDATION_ERROR";
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setOtp("");
    setErrors({});
    setLoading(true);
    const requestData = {
      otp: {
        mobileNumber: null,
        dbtId: null,
        ticketId,
        categoryType:
          service.value === "GRM" ? "GRM_TICKET_GET" : "SCHEME_APP_GET",
        tenantId: "br",
        userType: "CITIZEN",
      },
    };
    const response = await SchemeService.otpFarmerSchemeGet(requestData);
    if (response?.ResponseInfo?.status === "successful") {
      const contact = response?.message;
      setOtpValidationError({ message: "" });
      dispatchNotification("success", [t("schemes.otpSuccess")], dispatch);
      setWaitTime(30);
      setMobileNumber(contact);
    } else {
      setOtpValidationError({
        message: response?.Errors?.[0]?.code || "SOMETHING_WENT_WRONG",
        notFound: true,
      });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setVerificationLoading(true);
    const payload = {
      entitySearchRequest: {
        mobileNumber: null,
        dbtId: null,
        ticketId,
        categoryType:
          service.value === "GRM" ? "GRM_TICKET_GET" : "SCHEME_APP_GET",
        tenantId: "br",
        otp: otp,
      },
    };
    const response = await validateFarmerOtp(payload);
    if (response?.status === 200) {
      if (service.value === "GRM") {
        navigate(`${window.contextPath}/track/complaintdetails/${ticketId}`, {
          state: { stateComplaintId: ticketId },
        });
      } else {
        setData(response.data.proxyResponse);
        setOtp("");
        setMobileNumber("");
        setService(null);
        setTicketId("");
      }
    } else {
      const { data } = response;
      setOtpValidationError({
        message:
          data?.Errors?.[0]?.code ||
          data?.error?.fields?.[0]?.message ||
          "SOMETHING_WENT_WRONG",
      });
      setOtp("");
    }
    setVerificationLoading(false);
  };

  return (
    <Box className="w-[95%] sm:w-11/12 m-auto mt-5 max-w-content-max-width">
      <Box className="breadcrumbs-container my-5">
        <BasicBreadcrumbs
          trackScheme={[
            ...(data?.dfsSchemeApplicationId ? ["trackScheme"] : []),
          ]}
          handleService={setData}
        />
      </Box>
      {!data.dfsSchemeApplicationId && (
        <Box className="container-card">
          <Box>
            <Typography
              variant={isMobile ? "h5" : "h3"}
              className="agent-grm-card-header"
            >
              {t("agentTrack.TRACK_SERVICE")}
            </Typography>
            <Typography className="agent-grm-card-sub-header">
              {t("agentTrack.TRACK_SERVICE_SUBTEXT")}
            </Typography>
          </Box>
          <Box className="grm-form-inner-cards-container">
            <Box className="grm-form-inner-card">
              <Box className="lg:flex gap-2 lg:w-4/5 mt-2">
                <Box className="w-full mb-5 lg:mb-0">
                  <Typography className="support-input-field-label">
                    {t("agentTrack.TRACK")}*
                  </Typography>
                  <CustomDropdown
                    id="support-issue-category"
                    options={trackServices}
                    getOptionLabel={(option) => t(option.title)}
                    size="small"
                    renderInput={(params) => (
                      <TextField {...params} placeholder={t("COMMON_SELECT")} />
                    )}
                    onChange={(event, newValue) =>
                      handleServiceChange(newValue)
                    }
                    value={service}
                  />
                  {errors?.service ? (
                    <Typography
                      color={"#d32f2f"}
                      sx={{ fontSize: "12px", marginTop: "10px" }}
                    >
                      {t(errors?.service)}
                    </Typography>
                  ) : (
                    <Typography
                      color={"#5C6460"}
                      sx={{ fontSize: "12px", marginTop: "10px" }}
                    >
                      {t("agentTrack.SELECT_TRACK_OPTION")}
                    </Typography>
                  )}
                </Box>
                <Box className="w-full">
                  <Typography className="support-input-field-label">
                    {t(`agentTrack.${service?.value ?? "GRM"}_TICKET_NUMBER`)}*
                  </Typography>
                  <CustomTextField
                    id="outlined-ticket-id"
                    size="small"
                    placeholder={
                      service !== null
                        ? service?.value === "SCHEME"
                          ? "DFS-XXXX-XXXX-XXXX"
                          : "PGR-XXXX-XXXX-XXXX"
                        : ""
                    }
                    fullWidth
                    onChange={(e) => handleInputChange(e)}
                    value={ticketId}
                    inputProps={{
                      maxLength: 36,
                    }}
                  />
                  {errors?.ticketId ? (
                    <Typography color={"#d32f2f"} sx={{ fontSize: "12px" }}>
                      {t(errors?.ticketId)}
                    </Typography>
                  ) : (
                    <Typography color={"#5C6460"} sx={{ fontSize: "12px" }}>
                      {t(
                        `agentTrack.${
                          service?.value ?? "GRM"
                        }_TICKET_NUMBER_ENTER`
                      )}
                    </Typography>
                  )}
                </Box>
                <Box className="flex items-center justify-center ml-2">
                  {loading && (
                    <CircularProgress
                      color="success"
                      size="32px"
                      thickness={6}
                    />
                  )}
                </Box>
              </Box>
              {otpValidationError?.notFound && (
                <Box className="text-secondary mt-2">
                  {t(otpValidationError.message)}
                </Box>
              )}
            </Box>
          </Box>
          {mobileNumber && (
            <OtpInputRenderer
              mobileNumber={mobileNumber}
              otpValue={otp}
              setOtpValue={setOtp}
              otpValidationError={otpValidationError}
              setOtpValidationError={setOtpValidationError}
              dispatch={dispatch}
              t={t}
              isSubmit={false}
              waitTime={waitTime}
              setWaitTime={setWaitTime}
              onResendOtp={handleOtpSend}
              handleVerifyOtp={handleVerifyOtp}
              verificationLoading={verificationLoading}
            />
          )}
          <Box className="flex justify-between">
            <CustomButton
              color={ButtonColor.SECONDARY}
              onClick={() => navigate(`${window.contextPath}/home`)}
            >
              {t("COMMON_CLOSE")}
            </CustomButton>
            <Box className="flex gap-2">
              <CustomButton
                onClick={handleOtpSend}
                state={mobileNumber ? "disabled" : "enabled"}
              >
                {t("COMMON_NEXT")}
                <ArrowForwardIcon sx={{ marginLeft: "8px" }} />
              </CustomButton>
            </Box>
          </Box>
        </Box>
      )}
      {data.dfsSchemeApplicationId && (
        <SchemesTrack data={data} handleService={setData} isMobile={isMobile} />
      )}
    </Box>
  );
}

export default TrackService;
