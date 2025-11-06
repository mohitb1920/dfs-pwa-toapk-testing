import { Box, Container } from "@mui/material";
import React, { useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import FarmerDbtVerification from "../../components/FarmerDbtVerification";
import { useNavigate } from "react-router-dom";
import { TENANT_ID } from "../../components/Utils";
import { validateFarmerOtp } from "../../services/AgentService";
import { SOMETHING_WENT_WRONG } from "../../constants";

export const getPayload = ({
  dbtId,
  categoryType,
  additionalFileds = {},
  customSearchCriteria = {},
  additionalPayload = {},
  isSchemesCall = false,
}) => {
  return {
    entitySearchRequest: {
      mobileNumber: null,
      dbtId: dbtId,
      payload: {
        SearchCriteria: {
          ...(!isSchemesCall
            ? { dbtId: dbtId, sortBy: "application_date desc" }
            : {}),
          tenantId: TENANT_ID,
          ...customSearchCriteria,
        },
        ...additionalPayload,
      },
      categoryType,
      tenantId: TENANT_ID,
      echoResponse: null,
      ...additionalFileds,
    },
  };
};

function FarmerPassbookOtpPage() {
  const [otpValue, setOtpValue] = useState("");
  const [otpValidationError, setOtpValidationError] = useState({
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyOTP = async (otp, dbtId) => {
    const payload = getPayload({
      dbtId,
      categoryType: "FARMER_PASSBOOK_GET",
      additionalFileds: { otp },
      customSearchCriteria: { pageNo: 1, pageSize: 10 },
    });
    setLoading(true);
    const response = await validateFarmerOtp(payload);
    if (response?.status === 200) {
      const { proxyResponse } = response?.data ?? {};
      navigate(`${window.contextPath}/agent-access/farmer-passbook`, {
        state: {
          response: { ...proxyResponse },
          dbtId,
        },
      });
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
        <Box className="breadcrumbs-container mb-[24px]">
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
            headerText={"FARMER_PASSBOOK"}
            categoryType={"FARMER_PASSBOOK_GET"}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default FarmerPassbookOtpPage;
