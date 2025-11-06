import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

function ReportValue({ name, value }) {
  return (
    <Box className=" flex flex-col items-center justify-center gap-4">
      <Typography variant="body1">{name}</Typography>
      <Box
        className="flex  w-full items-center justify-center px-[10px] py-2 rounded-lg"
        sx={{ border: "solid 1px rgba(222, 222, 222, 1)" }}
      >
        <Typography variant="body1" className="value-card-details">
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
ReportValue.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};
export default ReportValue;
