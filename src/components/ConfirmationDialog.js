import { Box, CircularProgress, Dialog, IconButton } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
import { ColorButton } from "../components/Utils";
import CloseIcon from "@mui/icons-material/Close";

function ConfirmationDialog(props) {
  const { onClose, open, children, loading, status, t } = props;

  return (
    <Dialog open={open}>
      {!loading && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <Box className="confirmation-dialog">
        {loading ? (
          <CircularProgress color="success" className="circular-loader" />
        ) : status ? (
          <img
            alt="attachment"
            src={`${window.contextPath}/assets/success.gif`}
            className="success-gif"
          />
        ) : (
          <img
            alt="attachment"
            src={`${window.contextPath}/assets/error.gif`}
            className="success-gif"
          />
        )}
        <Box className="flex justify-center flex-col text-center min-h-20 min-w-80 ">
          {children}
        </Box>
        <ColorButton
          variant="contained"
          bgcolor="#A5292B"
          fullWidth
          hoverbgcolor="#7a1f20"
          onClick={onClose}
          disabled={loading}
        >
          {t("COMMON_DONE")}
        </ColorButton>
      </Box>
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.element,
  loading: PropTypes.bool,
  status: PropTypes.bool,
};

export default ConfirmationDialog;
