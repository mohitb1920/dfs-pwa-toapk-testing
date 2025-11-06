import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const UrlDialog = ({
  open,
  externalUrl,
  handleClose,
  t,
  content = "dialogContent",
  showCloseButton = true,
  proceedProps = { proceed: true },
}) => {
  return (
    <Dialog
      open={open}
      onClose={showCloseButton ? () => handleClose(false) : () => {}}
      aria-labelledby="dialog-title"
      PaperProps={{
        style: {
          position: "absolute",
          top: 0,
          margin: 0,
          left: "50%",
          transform: "translateX(-50%)",
        },
      }}
    >
      <DialogTitle>{window.location.origin}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t(content)}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {showCloseButton && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleClose({});
            }}
            color="primary"
          >
            {t("Cancel")}
          </Button>
        )}
        <Button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleClose(proceedProps);
          }}
          color="primary"
          autoFocus
        >
          {t("OK")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UrlDialog;
