import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { dispatchNotification, TENANT_ID } from "../../../components/Utils";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { Document, Page } from "react-pdf";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SoilHealthService } from "../../../services/SoilHealthService";
import PropTypes from "prop-types";
function SoilHealthCardFileRenderer({
  t,
  language,
  setSelectedSoilCard,
  testGrid,
  url,
  fileDownload,
  setDownloadCardCriteria,
  downloadCardCriteria,
  isMobile,
}) {
  const [shareClicked, setShareClicked] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(null);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpen = () => setOpenDialog(true);
  const handleClose = () => setOpenDialog(false);

  const dbtIdData = useSelector((state) => {
    return state.soilHealthReducer.dbtID;
  });
  const responseData = useSelector((state) => {
    return state.soilHealthReducer.response;
  });
  const dispatch = useDispatch();
  const shareSoilHealthReport = async () => {
    if (isShareLoading) {
      return;
    }
    setIsShareLoading(true);
    const response = await SoilHealthService.makeSoilHealthDetailCall({
      dbtId: dbtIdData,
      categoryType: "SOIL_CARD_DOWNLOAD_GET",
      tenantId: TENANT_ID,
      tokenId: responseData?.tokenId,
      testGrid: testGrid,
      DownloadCardCriteria: downloadCardCriteria,
    });
    if (
      response?.status == 200 &&
      response?.["data"]?.["proxyResponse"]?.["DownloadCard"]?.["Success"]
    ) {
      setOpenDialog(false);
      setIsShareLoading(false);
      dispatchNotification("success", [t("whatsAppSuccess")], dispatch);
    } else {
      dispatchNotification("error", [t("whatsAppFailure")], dispatch);
      navigate(`${window.contextPath}/farmer-details`);
    }
    setIsShareLoading(false);
  };
  useEffect(() => {
    if (shareClicked) {
      shareSoilHealthReport();
    }
    setShareClicked(false);
  }, [shareClicked]);
  const shareOnWhatApp = () => {
    setDownloadCardCriteria((prevValue) => ({ ...prevValue, OpType: "W" }));
    setShareClicked(true);
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box className="grm-form-inner-cards-container !p-10 gap-5">
        <Box
          className={`flex px-8 py-6 gap-6 inner-detail-container items-center justify-between ${
            isMobile ? "flex-col" : "flex-row"
          }`}
          style={{ background: theme.palette.background.default }}
        >
          <Box className="flex justify-start items-center ">
            <IconButton onClick={() => setSelectedSoilCard(0)}>
              <ArrowBackIosNewOutlinedIcon />
            </IconButton>
            <Typography>{t("BasedInput")}</Typography>
          </Box>
          <Box className="flex justify-end items-center gap-4 ">
            <Button
              variant="secondary"
              startIcon={<ShareOutlinedIcon />}
              onClick={() => handleOpen()}
            >
              {t("Share")}
            </Button>
            <Button
              variant="secondary"
              startIcon={<FileDownloadOutlinedIcon />}
              onClick={() => fileDownload(url, true)}
            >
              {t("Download")}
            </Button>
          </Box>
        </Box>
      </Box>
      <Box className="grm-form-inner-cards-container !p-10 gap-5">
        <iframe
          src={url}
          width="100%"
          height="600px"
          title="PDF Viewer"
        ></iframe>
      </Box>

      {/*Dialog box */}
      <Dialog
        open={openDialog}
        onClose={handleClose} // Close when clicking outside
        aria-labelledby="custom-dialog-title"
        className="rounded-lg"
      >
        {/* Dialog Title with a Close Button */}
        <DialogTitle>
          <Box className="flex justify-center items-center">
            <Typography
              variant="h5"
              sx={{ color: theme.palette.text.textGreen, fontWeight: 600 }}
            >
              {t("Share")}
            </Typography>
          </Box>
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent>
          <Box className="flex flex-col items-center gap-2">
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.textGrey }}
            >
              {t("whereShare")}
            </Typography>
            <Box className="flex items-center justify-evenly w-full">
              <Box>
                <div className="relative inline-block">
                  <IconButton onClick={shareOnWhatApp}>
                    <img
                      src={`${window.contextPath}/assets/light/whatsapp_icon.svg`}
                      alt="WhatsApp Icon"
                    />
                  </IconButton>
                  {isShareLoading && (
                    <div className="absolute inset-0 flex items-center justify-center  rounded-full">
                      <CircularProgress />
                    </div>
                  )}
                </div>
              </Box>
              <img
                src={`${window.contextPath}/assets/light/message.svg`}
                style={{ opacity: 0.4 }}
              />
              <img
                src={`${window.contextPath}/assets/light/logos_telegram.svg`}
                style={{ opacity: 0.4 }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
SoilHealthCardFileRenderer.propTypes = {
  setSelectedSoilCard: PropTypes.any,
  testGrid: PropTypes.any,
  url: PropTypes.any,
  fileDownload: PropTypes.func,
  setDownloadCardCriteria: PropTypes.any,
  downloadCardCriteria: PropTypes.any,
  t: PropTypes.func,
};
export default SoilHealthCardFileRenderer;
