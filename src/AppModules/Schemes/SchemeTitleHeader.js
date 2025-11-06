import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { ExtractYear, getCurrentLanguage } from "../../components/Utils";

const SchemeTitleHeader = ({
  schemeId,
  level,
  scheme,
  startDate,
  endDate,
  active,
  modifyDate,
  department
}) => {
  const startYear = startDate && ExtractYear(startDate);
  const endYear = ExtractYear(endDate);
  const { t } = useTranslation();
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = `${process.env.PUBLIC_URL}/assets/SchemeLogos/other_schemes.png`;
  };

  const language = getCurrentLanguage() === "hi_IN" ? "hi" : "en";
  const theme = useTheme();

  let schemeLevel = "schemes.schemesForFarmers";
  if (level === "state") schemeLevel = "schemes.stateScheme";
  else if (level === "centrally_sponsored")
    schemeLevel = "schemes.centralSponsored";
  else if (level === "central") schemeLevel = "schemes.centralScheme";

  const StatusTag = () =>
    active !== undefined && (
      <Typography
        className={`status-tag ${active ? "status-active" : "status-inactive"}`}
      >
        {t(active ? "schemes.open" : "schemes.closed")}
      </Typography>
    );

  return (
    <Box className="scheme-title-container">
      <Box className="scheme-title-logo-container">
        <StatusTag />
      </Box>

      <Box className="scheme-title-header-content">
        <Box className="scheme-logo-container">
          <Box className="scheme-logo-wrapper">
            <Box
              component="img"
              className="schemes-details-logo"
              alt="Logo"
              src={`${process.env.PUBLIC_URL}/assets/SchemeLogos/${schemeId}.svg`}
              sx={{ position: "relative", zIndex: 10 }}
              onError={handleImageError}
            />
          </Box>
        </Box>
        <Box className="scheme-title-header-details">
          <Box className="status-tag-container-desktop">
            <StatusTag />
          </Box>
          <Box className="scheme-title-header-text">
            <Box className="scheme-title-box">
              <Typography
                variant="h2"
                className="page-title"
                color={theme.palette.text.primary}
              >
                {scheme[`title-${language}`]}
              </Typography>
            </Box>
            <Box className="scheme-details-subheading">
              {department && (
                <Typography
                  className="scheme-details-scheme-level pr-2"
                  color={theme.palette.text.textGrey}
                >
                  {department[language]}
                </Typography>
              )}
              <Typography
                className="scheme-details-scheme-level"
                color={theme.palette.text.textGrey}
              >
                {t(schemeLevel)}
              </Typography>
              {startYear && (
                <>
                  <Typography
                    className="scheme-details-scheme-level separator"
                    color={theme.palette.text.textGrey}
                  >
                    |
                  </Typography>
                  <Typography
                    className="scheme-details-scheme-level"
                    color={theme.palette.text.textGrey}
                  >
                    {t("schemes.applicationWindow")}: {startYear}-{endYear}
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SchemeTitleHeader;
