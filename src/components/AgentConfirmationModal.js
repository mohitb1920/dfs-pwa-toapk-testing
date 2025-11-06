import { Box, CircularProgress, Dialog, IconButton } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "./Button/CustomButton";
import { ButtonColor, ButtonSize, ButtonState } from "./Button/ButtonEnums";
import "../styles/AgentConfirmationDialog.css";

function AgentConfirmationDialog(props) {
  const {
    onClose,
    open,
    children,
    loading,
    status,
    t,
    isDownloadable = false,
    onDownloadClick,
  } = props;

  return (
    <Dialog open={open} className="confirmation-dialog-root">
      {!loading && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            zIndex: 1000,
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Box className="confirmation-dialog-card">
        {loading ? (
          <CircularProgress color="success" className="circular-loader" />
        ) : status ? (
          <img
            alt="attachment"
            src={`${window.contextPath}/assets/agentOperationSuccess.svg`}
          />
        ) : (
          <img
            alt="attachment"
            src={`${window.contextPath}/assets/agentOperationFail.svg`}
          />
        )}
        <Box className="confirmation-dialog-text-box">{children}</Box>
        <Box className="flex flex-col gap-2 w-full">
          <CustomButton
            size={ButtonSize.MEDIUM}
            color={loading ? ButtonColor.NEUTRAL : ButtonColor.PRIMARY}
            state={loading ? ButtonState.DISABLED : ButtonState.ENABLED}
            onClick={onClose}
          >
            {t("COMMON_DONE")}
          </CustomButton>
          {isDownloadable && (
            <CustomButton
              size={ButtonSize.MEDIUM}
              color={loading ? ButtonColor.NEUTRAL : ButtonColor.SECONDARY}
              state={loading ? ButtonState.DISABLED : ButtonState.ENABLED}
              onClick={onDownloadClick}
            >
              {t("COMMON_DOWNLOAD_RECIEPT")}
            </CustomButton>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}

AgentConfirmationDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.element,
  loading: PropTypes.bool,
  status: PropTypes.bool,
  isDownloadable: PropTypes.bool,
  onDownloadClick: PropTypes.func,
};

export default AgentConfirmationDialog;
