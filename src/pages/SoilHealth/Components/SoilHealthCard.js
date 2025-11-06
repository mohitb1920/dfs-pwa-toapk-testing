import { Box } from "@mui/material";
import React from "react";
import SoilHealthCardCrop from "./SoilHealthCardCrop";
import PropTypes from "prop-types";

function SoilHealthCard({ isMobile, t, language }) {
  return (
    <Box>
      <SoilHealthCardCrop isMobile={isMobile} t={t} language={language} />
    </Box>
  );
}
SoilHealthCard.propTypes = {
  isMobile: PropTypes.bool,
  t: PropTypes.func,
  language: PropTypes.string,
};
export default SoilHealthCard;
