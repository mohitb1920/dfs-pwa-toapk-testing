import React from "react";
import { Typography, Tooltip } from "@mui/material";

const TitleWithTooltip = ({ title, language, className, color, textAlign = "center" }) => {
  return (
    <Tooltip title={title} arrow>
      <Typography
        color={color}
        variant="h6"
        className={`${className} truncate-title`}
        sx={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: `${textAlign} !important`,
          "&:hover": {
            cursor: "pointer",
          },
        }}
      >
        {title}
      </Typography>
    </Tooltip>
  );
};

export default TitleWithTooltip;
