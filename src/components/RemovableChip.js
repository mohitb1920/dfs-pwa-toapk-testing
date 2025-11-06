import { Box, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import "../styles/RemovableChip.css";

function RemovableChip({ text, onClick, disabled = false }) {
  return (
    <Box className="removable-chip">
      <Typography className="text">{text}</Typography>
      <span onClick={disabled ? null : onClick}>
        <CloseIcon className="cursor-pointer" />
      </span>
    </Box>
  );
}

export default RemovableChip;
