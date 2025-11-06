import * as React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogContent, IconButton } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PropTypes from "prop-types";

function CustomModal(props) {
  const { handleModalClose, open, dialogHeader, maxWidth } = props;

  const handleClose = () => {
    handleModalClose();
  };

  return (
    <Dialog open={open} fullWidth={true} maxWidth={maxWidth}>
      <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
        {dialogHeader}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        size="large"
        sx={{
          position: "absolute",
          right: 8,
          top: 10,
          color: "#1C274C",
        }}
      >
        <CancelOutlinedIcon />
      </IconButton>
      <DialogContent sx={{padding: "10px 20px"}}>{props.children}</DialogContent>
    </Dialog>
  );
}

CustomModal.propTypes = {
  handleModalClose: PropTypes.func,
  open: PropTypes.bool,
  dialogHeader: PropTypes.string,
  maxWidth: PropTypes.string,
  children: PropTypes.element,
};

export default CustomModal;
