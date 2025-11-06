import { Box, Container, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { useTranslation } from "react-i18next";
import helpData from "./HelpSupport.json";
import HelpCard from "./components/HelpCard";
import { useNavigate } from "react-router-dom";

function HelpAndSupportPage({ isMobile }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  const navigate = useNavigate();
  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  function handleClick(data) {
    const path = `${window.contextPath}/help/help-details`;
    navigate(path, {
      state: { id: data.id },
    });
  }
  const theme = useTheme();
  return (
    <Container variant="primary">
      <Box className="assets-page">
        <Box className=" !pb-10">
          <Box className="breadcrumbs-container" sx={{ pb: 1.5 }}>
            <BasicBreadcrumbs />
          </Box>
          <Box className="header-screen-reader">
            <Typography
              className="scheme-header-name"
              variant={isMobile ? "h5" : "h1"}
              sx={{
                whiteSpace: "noWrap",
              }}
            >
              {t("DFSWEB_HELP")}
            </Typography>
          </Box>
          <Box className="text-box-screen-reader">
            <Box className="schemes-grid">
              {helpData.help.map((data, index) => (
                <HelpCard data={data} onClick={handleClick} />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default HelpAndSupportPage;
