import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../../styles/page_layout.css";
import SoilHealthLabs from "./Components/SoilHealthLabs";
import SoilHealthCard from "./Components/SoilHealthCard";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dispatchNotification } from "../../components/Utils";
import PropTypes from "prop-types";

function SoilHealthPage({ isMobile }) {
  const { t, i18n } = useTranslation();
  const dbtIdData = useSelector((state) => {
    return state.soilHealthReducer.dbtID;
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (dbtIdData == null) {
      dispatchNotification("error", [t("SessionTimeout")], dispatch);
      navigate(`${window.contextPath}/farmer-details`);
    }
  }, []);
  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  const [selectedSoilTab, setSelectedSoilTab] = useState(0);

  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  return (
    <Container variant="primary">
      <Box className="inner-box-screen m-auto">
        <Box className="breadcrumbs-container mb-[24px]">
          <BasicBreadcrumbs />
        </Box>
        <Box className="page-header-layout">
          <Typography
            className="scheme-header-name"
            variant={isMobile ? "h5" : "h2"}
            sx={{
              whiteSpace: "noWrap",
            }}
          >
            {t("Soil_health")}
          </Typography>
        </Box>
        <Tabs
          value={selectedSoilTab}
          onChange={(e, value) => setSelectedSoilTab(value)}
          aria-label={t("soil_health_tabs")}
          textColor="primary"
          indicatorColor="primary"
          className="switch-tabs-layout"
        >
          <Tab
            label={t("soil_health_labs")}
            sx={{
              fontWeight: selectedSoilTab === 0 ? 800 : "normal",
              fontSize: "1.25rem",
            }}
            id="soil-tab-0"
            aria-controls="soil-tabpanel-0"
          />
          <Tab
            label={t("soil_health_card")}
            sx={{
              fontWeight: selectedSoilTab === 1 ? 800 : "normal",
              fontSize: "1.25rem",
            }}
            id="soil-tab-1"
            aria-controls="soil-tabpanel-1"
          />
        </Tabs>
        {selectedSoilTab === 0 && (
          <SoilHealthLabs t={t} language={language} location={location} />
        )}
        {selectedSoilTab === 1 && (
          <SoilHealthCard
            isMobile={isMobile}
            t={t}
            language={language}
            location={location}
          />
        )}
      </Box>
    </Container>
  );
}
SoilHealthPage.propTypes = {
  isMobile: PropTypes.bool,
};
export default SoilHealthPage;
