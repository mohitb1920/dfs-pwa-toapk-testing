import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import ValuePairComponent from "./ValuePairComponent";
import { useSoilCardDetailsData } from "../../../Hooks/useSoilHealthData";
import { useDispatch, useSelector } from "react-redux";
import ReportValue from "./ReportValue";
import {
  ConvertTimestampToDate,
  dispatchNotification,
  formatEpochDate,
  TENANT_ID,
} from "../../../components/Utils";
import { useNavigate } from "react-router-dom";
import { SoilHealthService } from "../../../services/SoilHealthService";
import PropTypes from "prop-types";
function SoilHealthCardDetails({
  t,
  setSelectedSoilCard,
  isMobile,
  setDownloadUrl,
  setDownloadCardCriteria,
  downloadCardCriteria,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const categoryType = "SOIL_CARD_DETAILS_GET";
  const [downloadFile, setDownloadFile] = useState(false);
  const responseData = useSelector((state) => {
    return state.soilHealthReducer.response;
  });
  const testGrid = useSelector((state) => {
    return state.soilHealthReducer.testGrid;
  });
  const dbtIdData = useSelector((state) => {
    return state.soilHealthReducer.dbtID;
  });
  let { data: soilCardDetails, isLoading: isSoilCardDetailsLoading } =
    useSoilCardDetailsData({
      categoryType: categoryType,
      dbtId: dbtIdData,
      testGrid: testGrid,
      tokenId: responseData?.tokenId,
    });
  const dispatch = useDispatch();
  const makeDownloadFileApi = async () => {
    const response = await SoilHealthService.makeSoilHealthDetailCall({
      dbtId: dbtIdData,
      categoryType: "SOIL_CARD_DOWNLOAD_GET",
      tenantId: TENANT_ID,
      tokenId: responseData?.tokenId,
      testGrid: testGrid,
      DownloadCardCriteria: downloadCardCriteria,
    });
    if (response?.status == 200) {
      const urlDownload =
        response?.["data"]?.["proxyResponse"]?.["DownloadCard"]?.[
          "DownloadPDFLink"
        ];
      setDownloadUrl(urlDownload);
    } else {
      dispatchNotification("error", ["SessionTimeout"], dispatch);
      navigate(`${window.contextPath}/farmer-details`);
    }
    setDownloadFile(false);
  };
  useEffect(() => {
    if (downloadFile) makeDownloadFileApi();
  }, [downloadFile]);

  const downloadFileDetails = () => {
    setDownloadCardCriteria((prevValues) => ({ ...prevValues, OpType: "D" }));
    setDownloadFile(true);
  };
  if (isSoilCardDetailsLoading) {
    return (
      <Box className="flex justify-center items-center h-[50vh]">
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box className="flex flex-col gap-6 pb-6">
      <Box className="grm-form-inner-cards-container items-end !p-4">
        <Box className="flex w-fit gap-4  items-center !justify-center">
          <Button
            variant="secondary"
            startIcon={<FileDownloadOutlinedIcon />}
            onClick={() => downloadFileDetails()}
          >
            {t("Download")}
          </Button>
          <Button
            variant="secondary"
            startIcon={<FilterAltOutlinedIcon />}
            onClick={() => setSelectedSoilCard(1)}
          >
            {t("Check_more_crop")}
          </Button>
        </Box>
      </Box>
      <Box className="grm-form-inner-cards-container !p-10 gap-5">
        <Box
          className={`flex flex-col  px-8 py-6 gap-6 inner-detail-container ${
            isMobile ? "!justify-start" : ""
          }`}
          style={{ background: theme.palette.background.default }}
        >
          <Box
            className={`flex justify-between items-center ${
              isMobile ? "flex-col !justify-start !items-start" : "flex-row"
            }`}
          >
            {soilCardDetails?.farmerName && (
              <Typography
                variant="h6"
                className={`${
                  isMobile
                    ? "key-value-valueStyle-mobile"
                    : "key-value-valueStyle"
                }`}
              >
                {t("name")}: {soilCardDetails?.farmerName}
              </Typography>
            )}
            {soilCardDetails?.khataKhasra && (
              <Typography
                variant="h6"
                className={`${
                  isMobile
                    ? "key-value-valueStyle-mobile"
                    : "key-value-valueStyle"
                }`}
              >
                {t("KhataKasara")}: {soilCardDetails?.khataKhasra}
              </Typography>
            )}
          </Box>
          <Box
            className={`flex justify-between items-center ${
              isMobile ? "flex-col !items-start !gap-4" : ""
            }`}
          >
            <ValuePairComponent
              t={t}
              name={"SoilHealthId"}
              value={soilCardDetails?.["testGrid"]}
              isMobile={isMobile}
            />
            {/* <ValuePairComponent
              t={t}
              name={"Validity"}
              value={ConvertTimestampToDate(
                soilCardDetails?.["AuditDetails"]?.["createdTime"],
                "dd-MM-yyyy"
              )}
              isMobile={isMobile}
            /> */}
          </Box>
        </Box>
        <Box
          className="flex flex-col px-8 py-6 gap-6 inner-detail-container"
          style={{ background: theme.palette.background.default }}
        >
          <Box className="flex justify-between items-center ">
            <Typography
              variant={isMobile ? "body" : "h5"}
              className={`${
                isMobile
                  ? "key-value-valueStyle-mobile"
                  : "key-value-valueStyle"
              }`}
            >
              {t("DataAnalysis")}
            </Typography>
          </Box>
          <Box className="flex justify-between items-center ">
            <Typography
              variant={isMobile ? "body" : "h6"}
              className={`${
                isMobile
                  ? "key-value-valueStyle-mobile"
                  : "key-value-valueStyle"
              }`}
            >
              {t("testDate")}{" "}
              {ConvertTimestampToDate(
                soilCardDetails?.["TestReport"]?.["ReportDate"],
                "dd/mm/yy"
              )}
            </Typography>
            <Typography
              variant={isMobile ? "body" : "h6"}
              className={`${
                isMobile
                  ? "key-value-valueStyle-mobile"
                  : "key-value-valueStyle"
              }`}
            >
              {t("Resource")}: RR
            </Typography>
          </Box>
          <Box className={"soil-Grid"}>
            {Object.entries(soilCardDetails?.["TestReport"] ?? {})
              .filter(([key]) => key !== "ReportDate" && key !== "TestGrid")
              .map(([key, value]) => (
                <ReportValue name={key} value={value} />
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
SoilHealthCardDetails.propTypes = {
  setSelectedSoilCard: PropTypes.any,
  isMobile: PropTypes.bool,
  setDownloadUrl: PropTypes.any,
  setDownloadCardCriteria: PropTypes.any,
  downloadCardCriteria: PropTypes.any,
  t: PropTypes.func,
};
export default SoilHealthCardDetails;
