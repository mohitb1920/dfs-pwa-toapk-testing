import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import FarmerDBTInput from "./FarmerDBTInput";
import { useTranslation } from "react-i18next";

function SchemeDBTInput({ schemeId, handleVerify, handleFarmerData }) {
  const handleGoBack = () => {
    window.history.back();
  };
  if (!schemeId) handleGoBack();
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box className="scheme-dbt-verification-form">
      <Box className="scheme-dbt-verification-header">
        <Typography
          variant="h3"
          className="font-bold"
          color={theme.palette.text.primary}
        >
          {t("schemes.schemeVerifyFarmer")}
        </Typography>
        <Typography variant="h6" color={theme.palette.text.textGrey}>
          {t("schemes.schemeVerifyFarmerSubtext")}
        </Typography>
      </Box>
      <FarmerDBTInput
        handleVerify={handleVerify}
        handleFarmerData={handleFarmerData}
      />
    </Box>
  );
}

export default SchemeDBTInput;
