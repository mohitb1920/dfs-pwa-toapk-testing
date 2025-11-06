import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";
import CustomButton from "./Button/CustomButton";
import { ButtonColor } from "./Button/ButtonEnums";
import { useTranslation } from "react-i18next";

function ActionConfirmationDialog(props) {
  const {
    open,
    setOpen,
    onContinueClick,
    isDelete = false,
    actionHeader,
    warningText,
  } = props;
  const { t } = useTranslation();

  return (
    <Dialog maxWidth="sm" open={open} fullWidth>
      <DialogTitle id="alert-dialog-title">{t(actionHeader)}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t(warningText)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <CustomButton
          color={ButtonColor.SECONDARY}
          onClick={() => setOpen(false)}
        >
          {t("COMMON_CANCEL")}
        </CustomButton>
        <CustomButton onClick={onContinueClick}>
          {isDelete ? t("COMMON_YES_DELETE") : t("COMMON_YES_LOGOUT")}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
}

export default ActionConfirmationDialog;
