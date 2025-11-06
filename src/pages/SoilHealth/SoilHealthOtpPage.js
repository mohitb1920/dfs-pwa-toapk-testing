import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import FarmerDbtVerification from "../../components/FarmerDbtVerification";
import { useNavigate } from "react-router-dom";
import { TENANT_ID } from "../../components/Utils";
import { validateFarmerOtp } from "../../services/AgentService";
import { SOMETHING_WENT_WRONG } from "../../constants";
import { useDispatch } from "react-redux";
import {
  soilHealthCardData,
  soilHealthCardDbtId,
} from "../../Modules/Actions/soilHealthActions";

function SoilHealthOtpPage() {
  const [otpValue, setOtpValue] = useState("");
  const [otpValidationError, setOtpValidationError] = useState({
    message: "",
  });
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const categoryType = "SOIL_CARD_STATUS_GET";
  const handleVerifyOTP = async (otp, dbtId) => {
    const payload = {
      entitySearchRequest: {
        dbtId: dbtId,
        categoryType: categoryType,
        tenantId: TENANT_ID,
        otp: otp,
      },
    };
    const response = await validateFarmerOtp(payload);
    if (response?.status === 200) {
      const { proxyResponse } = response?.data ?? {};
      dispatch(soilHealthCardData(proxyResponse));
      dispatch(soilHealthCardDbtId(dbtId));
      navigate(`${window.contextPath}/Soil_health`);
    } else {
      setOtpValidationError({
        message: response?.data?.Errors?.[0]?.code || SOMETHING_WENT_WRONG,
      });
      setOtpValue("");
    }
    setLoading(false);
  };

  return (
    <Container variant="primary">
      <Box className="inner-box-screen m-auto">
        <Box className="breadcrumbs-container mb-6">
          <BasicBreadcrumbs />
        </Box>
        <Box className="grm-form-inner-cards-container !gap-y-5">
          <FarmerDbtVerification
            handleVerifyOtp={handleVerifyOTP}
            otpValidationError={otpValidationError}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            setOtpValidationError={setOtpValidationError}
            verificationLoading={loading}
            headerText={"VERIFY_FARMER"}
            categoryType={categoryType}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default SoilHealthOtpPage;
