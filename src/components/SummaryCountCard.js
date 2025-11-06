import React from "react";
import { Box, Typography } from "@mui/material";
import "./../styles/SummaryCountCard.css";

function SummaryCountCard({
  label,
  value,
  t,
  cardProps,
  isClickable,
  handleClick,
  selected,
  isMobile,
}) {
  return (
    <Box
      className={`summary-count-card ${isClickable ? "cursor-pointer" : ""} ${
        selected ? "summary-count-card-selected" : ""
      }`}
      key={label}
      sx={{
        borderLeftColor: `${cardProps.color} !important`,
        ...(selected ? { borderColor: `${cardProps.color} !important` } : {}),
      }}
      onClick={() => handleClick(label)}
    >
      <img
        src={`${window.contextPath}/assets/light/${cardProps.icon}`}
        alt="DBT Linked"
        className="summary-count-icon"
      />
      <Box className="summary-text-container">
        <Typography
          variant={isMobile ? "caption" : "h7"}
          className="summary-count-text"
        >
          {t(label)}
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          className="summary-count-text"
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default SummaryCountCard;
