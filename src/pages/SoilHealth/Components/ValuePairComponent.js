import { Box, Typography } from "@mui/material";
import React from "react";
import "../SoilStyles.css";
import PropTypes from "prop-types";

function ValuePairComponent({ t, name, value, isMobile }) {
  return (
    <Box className={`gap-2 flex flex-col ${isMobile ? "!flex-row" : ""} `}>
      <Typography
        variant="body1"
        className={`key-value-keyStyle ${isMobile ? "!font-semibold" : ""}`}
      >
        {t(name)}
      </Typography>
      <Typography
        variant={isMobile ? "body1" : "h6"}
        className={`${
          isMobile ? "key-value-valueStyle-mobile" : "key-value-valueStyle"
        }`}
      >
        {value}
      </Typography>
    </Box>
  );
}
ValuePairComponent.propTypes = {
  isMobile: PropTypes.bool,
  value: PropTypes.string,
  name: PropTypes.string,
  t: PropTypes.func,
};
export default ValuePairComponent;
