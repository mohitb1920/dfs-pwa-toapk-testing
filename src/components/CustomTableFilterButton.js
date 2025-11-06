import React from "react";
import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "../styles/CustomTableFilterButton.css";
import InteractiveElement from "./InteractiveElement/InteractiveElement";

function CustomTableFilterButton(props) {
  const {
    onClick,
    title,
    t,
    pending = false,
    testid = "filter-button",
    active = false,
  } = props;
  return (
    <InteractiveElement onClick={onClick} sx={{ borderRadius: "8px" }}>
      <Box
        className={`custom-table-filter ${
          active && "custom-table-filter-active"
        }`}
        // onClick={onClick}
        data-testid={testid}
      >
        {pending ? (
          <AccessTimeIcon
            className={`mr-2 ${active && "filter-icon-active"}`}
            color="warning"
          />
        ) : (
          <CheckCircleOutlineIcon
            className={`text-primary mr-2 ${active && "filter-icon-active"}`}
          />
        )}
        <Typography
          variant="h7"
          className={`table-filter-text ${
            active && "active-table-filter-text"
          }`}
        >
          {t(title)}
        </Typography>
      </Box>
    </InteractiveElement>
  );
}

export default CustomTableFilterButton;
