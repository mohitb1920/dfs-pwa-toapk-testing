import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../../../components/BreadCrumbsBar";
import FarmerDbtVerification from "../../../components/FarmerDbtVerification";
import { validateFarmerOtp } from "../../../services/AgentService";
import { SOMETHING_WENT_WRONG } from "../../../constants";
import { useNavigate } from "react-router-dom";
import { getCurrentLanguage, TENANT_ID } from "../../../components/Utils";
import { useLocalizationStore } from "../../../Hooks/Store";
import CustomStepper from "../../../components/CustomStepper";

export const grmSteps = ["VERIFY_FARMER", "APPLICATION_FORM", "PREVIEW_SUBMIT"];

function CreateComplaint({ isMobile }) {
  const [otpValue, setOtpValue] = useState("");
  const [otpValidationError, setOtpValidationError] = useState({
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const stateCode = TENANT_ID;
  const moduleCode = "dfs-grm";
  const language = getCurrentLanguage();
  useLocalizationStore({
    stateCode,
    moduleCode,
    language,
  });

  const handleVerifyOTP = async (otp, dbtId) => {
    setLoading(true);
    const paylaod = {
      entitySearchRequest: {
        mobileNumber: null,
        dbtId: dbtId,
        ticketId: null,
        categoryType: "PROFILE_GET",
        tenantId: "br",
        otp: otp,
      },
    };

    const response = await validateFarmerOtp(paylaod);
    if (response?.status === 200) {
      const { proxyResponse } = response?.data ?? {};
      sessionStorage.setItem(
        "Agent-grm-farmerData",
        JSON.stringify(proxyResponse?.Individual)
      );
      navigate(`${window.contextPath}/grm-create/grm-application`);
    } else {
      setOtpValidationError({
        message: response?.data?.Errors?.[0]?.code || SOMETHING_WENT_WRONG,
      });
      setOtpValue("");
    }
    setLoading(false);
  };

  useEffect(() => {
    sessionStorage.removeItem("Agent-grm-farmerData");
    sessionStorage.removeItem("Agent-GRM-formData");
  }, []);

  return (
    <Box className="w-[95%] sm:w-11/12 m-auto mt-5 max-w-content-max-width mb-[80px]">
      <Box className="breadcrumbs-container mb-[24px]">
        <BasicBreadcrumbs />
      </Box>
      {!isMobile && (
        <Box className="pb-[40px] pt-[16px]">
          <CustomStepper steps={grmSteps} activeStep={0} />
        </Box>
      )}
      <Box className="grm-form-inner-cards-container">
        <FarmerDbtVerification
          handleVerifyOtp={handleVerifyOTP}
          otpValidationError={otpValidationError}
          otpValue={otpValue}
          setOtpValue={setOtpValue}
          setOtpValidationError={setOtpValidationError}
          verificationLoading={loading}
        />
      </Box>
    </Box>
  );
}

export default CreateComplaint;
