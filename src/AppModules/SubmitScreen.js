import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Typography, Box, useTheme } from "@mui/material";
import { SchemeService } from "../services/Schemes";
import { dispatchNotification } from "../components/Utils";
import { useDispatch } from "react-redux";
import AgentConfirmationDialog from "../components/AgentConfirmationModal";
import "../styles/AgentConfirmationDialog.css";

function SubmitScreen({
  submissionStatus,
  handleModalClose,
  applicationId,
  schemeName,
}) {
  const [open, setOpen] = useState(true);
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const loading = false;
  const handleClose = () => {
    setOpen(false);
    handleModalClose();
  };

  const handleDownload = async () => {
    try {
      const data = {
        RequestInfo: {
          ts: 0,
          action: "string",
          did: "string",
          key: "string",
          msgId: "string",
          requesterId: "string",
        },
      };
      const response = await SchemeService.schemeReceipt(
        data,
        applicationId?.dfsSchemeApplicationId
      );
      if (response?.status === 200) {
        const url = window.URL.createObjectURL(response?.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `${applicationId?.dfsSchemeApplicationId}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(
          response?.data?.Errors?.[0]?.code || "COMMON_PDF_DOWNLOAD_FAIL"
        );
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    }
  };
  return (
    <>
      <AgentConfirmationDialog
        open={open}
        loading={false}
        status={true}
        t={t}
        onClose={handleClose}
        isDownloadable={true}
        onDownloadClick={handleDownload}
      >
        <Box className="" data-testid="ticket-details">
          <Typography
            variant="h5"
            className="confirmation-dialog-text-main"
            color={theme.palette.text.textGreen}
          >
            {t("COMMON_CONGRATS")}
          </Typography>
          <Typography
            variant="body2"
            className="confirmation-dialog-text-sub"
            color={theme.palette.text.textGrey}
          >
            {t("schemes.SCHEME_CREATE_MESSAGE")}
          </Typography>
        </Box>
      </AgentConfirmationDialog>
    </>
  );
}

export default SubmitScreen;
