import { Box, CircularProgress, Dialog } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

import CustomButton from "../../components/Button/CustomButton";
import {
  ButtonColor,
  ButtonSize,
  ButtonState,
} from "../../components/Button/ButtonEnums";
import success from "../../../src/assets/success.svg";

function AgentConfirmationDialog(props) {
  const {
    open,
    children,
    loading,
    status,
    onDOwnloadClick,
    downloadReceipt,
    handleNavigateToHome,
    t,
  } = props;

  return (
    <Dialog open={open}>
      <Box className="confirmation-dialog">
        {loading ? (
          <CircularProgress color="success" className="circular-loader" />
        ) : status ? (
          <img alt="attachment" src={success} style={{ height: "95px" }} />
        ) : (
          <img
            alt="attachment"
            src={`${window.contextPath}/assets/agentOperationFail.svg`}
            style={{ height: "95px" }}
          />
        )}
        <Box className="flex justify-center flex-col text-center min-h-20 min-w-60 sm:min-w-80">
          {children}
        </Box>
        <Box className="flex flex-col gap-2 w-full">
          <CustomButton
            size={ButtonSize.MEDIUM}
            color={loading ? ButtonColor.NEUTRAL : ButtonColor.PRIMARY}
            state={loading ? ButtonState.DISABLED : ButtonState.ENABLED}
            onClick={handleNavigateToHome}
          >
            {t("COMMON_DONE")}
          </CustomButton>
          {downloadReceipt && (
            <CustomButton
              size={ButtonSize.MEDIUM}
              color={loading ? ButtonColor.NEUTRAL : ButtonColor.SECONDARY}
              state={loading ? ButtonState.DISABLED : ButtonState.ENABLED}
              onClick={onDOwnloadClick}
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
};

export default AgentConfirmationDialog;
