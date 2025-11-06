import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { farmerDetailHeaders, maskDigits } from "./Utils";
import { useTranslation } from "react-i18next";
import CustomTextDispayBox from "./CustomTextDispayBox";

function FarmerDetailsCard(props) {
  const { t } = useTranslation();
  const theme = useTheme()
  const { farmerDetails } = props;

  return (
    <Box className="details-box-border-v2">
      <Box className="flex items-center px-5">
        <img
          src={`${window.contextPath}/assets/${theme.palette.mode}/documents-wrap.svg`}
          alt="Details Icon"
          width={40}
          height={40}
        />
        <Typography className="personal-details-box-header">
          {t("PERSONAL_DETAILS")}
        </Typography>
      </Box>
      <Grid container spacing={3} className="farmer-grid-v2">
        {Object.entries(farmerDetailHeaders).map(([key, value]) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={key}
            sx={{ paddingTop: "0px !important", paddingBottom: "18px" }}
          >
            <Typography variant="subtitle1" className="farmer-key-v2">
              {t(value)}
            </Typography>
            <CustomTextDispayBox>
              {key === "dbtId"
                ? maskDigits(farmerDetails[`${key}`] ?? "-")
                : farmerDetails[`${key}`] ?? "-"}
            </CustomTextDispayBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default FarmerDetailsCard;
