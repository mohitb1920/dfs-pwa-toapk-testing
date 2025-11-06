import React, { useEffect, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { Box, Container, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../../styles/page_layout.css";
import SoilHealthCardDetails from "./Components/SoilHealthCardDetails";
import SoilHealthCardCropForm from "./Components/SoilHealthCardCropForm";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SoilHealthCardFileRenderer from "./Components/SoilHealthCardFileRenderer";
import {
  dispatchNotification,
  getFileNameFromURL,
} from "../../components/Utils";
import PropTypes from "prop-types";

function SoilHealthDetailsPage({ isMobile }) {
  const { t, i18n } = useTranslation();
  const l = useLocation();
  const { testGrid, farmerName, tokenId } = l.state ?? "";
  const dbtIdData = useSelector((state) => {
    return state.soilHealthReducer.dbtID;
  });
  const [downloadCardCriteria, setDownloadCardCriteria] = useState({
    OpType: "D",
    TestGrid: testGrid,
    dbtRegNo: dbtIdData,
    fname: farmerName,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (dbtIdData == null) {
      dispatchNotification("error", [t("SessionTimeout")], dispatch);
      navigate(`${window.contextPath}/farmer-details`);
    }
  }, []);

  const theme = useTheme();
  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  const [selectedSoilCard, setSelectedSoilCard] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState();
  useEffect(() => {
    if (selectedSoilCard === 0 && downloadUrl) {
      fileDownload(downloadUrl);
    }
  }, [downloadUrl]);
  const fileDownload = (url, isRenderPage = false) => {
    const fileName = getFileNameFromURL(url);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = `${fileName}`; // Customize file name
    link.click(); // Trigger download
    // Clean up
    window.URL.revokeObjectURL(url);
    if (!isRenderPage) setDownloadUrl();
  };
  useEffect(() => {
    if (selectedSoilCard === 0) {
      setDownloadCardCriteria((prevValues) => ({
        ...prevValues,
        landqty: "None",
        Avlland: "None",
        FertN1: "None",
        FertP1: "None",
        FertK1: "None",
        FertN2: "None",
        FertP2: "None",
        FertK2: "None",
        crop1: "None",
        crop2: "None",
        crop3: "None",
        crop4: "None",
        tyl1: "None",
        tyl2: "None",
        tyl3: "None",
        tyl4: "None",
      }));
    }
  }, [selectedSoilCard]);
  const location = JSON.parse(localStorage.getItem("DfsWeb.locationData"));
  return (
    <Container variant="primary" id="soil-detail">
      <Box className="inner-box-screen m-auto pb-6">
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
            {t("soil_health_Detail")}
          </Typography>
        </Box>
        {selectedSoilCard === 0 && (
          <SoilHealthCardDetails
            t={t}
            language={language}
            setSelectedSoilCard={setSelectedSoilCard}
            testGrid={testGrid}
            isMobile={isMobile}
            setDownloadUrl={setDownloadUrl}
            setDownloadCardCriteria={setDownloadCardCriteria}
            downloadCardCriteria={downloadCardCriteria}
          />
        )}
        {selectedSoilCard === 1 && (
          <SoilHealthCardCropForm
            t={t}
            isMobile={isMobile}
            language={language}
            setSelectedSoilCard={setSelectedSoilCard}
            testGrid={testGrid}
            farmerName={farmerName}
            setDownloadUrl={setDownloadUrl}
            setDownloadCardCriteria={setDownloadCardCriteria}
            downloadCardCriteria={downloadCardCriteria}
            tokenId={tokenId}
          />
        )}
        {selectedSoilCard === 2 && (
          <SoilHealthCardFileRenderer
            t={t}
            language={language}
            setSelectedSoilCard={setSelectedSoilCard}
            testGrid={testGrid}
            isMobile={isMobile}
            url={downloadUrl}
            fileDownload={fileDownload}
            setDownloadCardCriteria={setDownloadCardCriteria}
            downloadCardCriteria={downloadCardCriteria}
          />
        )}
      </Box>
    </Container>
  );
}
SoilHealthDetailsPage.propTypes = {
  isMobile: PropTypes.bool,
};
export default SoilHealthDetailsPage;
