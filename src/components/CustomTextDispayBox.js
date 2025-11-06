import { Box } from "@mui/material";
import React from "react";

function CustomTextDispayBox({ children, style }) {
  return (
    <Box className="custom-text-display-box" sx={style}>
      {children}
    </Box>
  );
}

export default CustomTextDispayBox;
