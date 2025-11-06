import { Typography, Box, Button, useTheme } from "@mui/material";
import React from "react";
import CustomButton from "./Button/CustomButton";
import { ButtonColor } from "./Button/ButtonEnums";

function SchemeTrackComponent({
  schemeApplicationId,
  applicationDate,
  applicationNumber,
  applicationStatus,
  handleDownloadClick,
  t,
}) {
  const theme = useTheme()
  let statusString = t(applicationStatus);
  const commonStyles = {
    fontSize: "14px",
    padding: "11px 16px",
    border: "1px solid #D7DEDA",
    borderRadius: "100px",
    fontWeight: 600,
    flexGrow: 1,
    textAlign: "center",
    width: "100%", // Default to full width
  };
  const responsiveStyles = {
    "@media (min-width: 800px)": {
      width: "calc(50% - 5px)", // 2 per line between 800px and 999px
    },
    "@media (min-width: 1200px)": {
      width: "calc(33.33% - 6.67px)", // 3 per line at 1000px and above
    },
  };
  if (applicationStatus === "REJECTED") {
    statusString = t("REJECTED_TRACK");
  }
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: "10px",
        }}
      >
        <Typography variant="h3" className="font-bold" color={theme.palette.text.textGreen}>
          {schemeApplicationId}
        </Typography>
        <CustomButton
          color={ButtonColor.SECONDARY}
          variant="outlined"
          noHover
          onClick={handleDownloadClick}
          sx={{ color: "black", borderColor: "black", fontSize: "1rem" }}
        >
          {t("COMMON_DOWNLOAD")}
        </CustomButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        {[
          {
            content: t("schemes.schemeCreated", {
              date: formatTimestampIndia(applicationDate),
            }),
            bgColor: "#ffffff",
            color: "inherit",
          },
          {
            content: t("schemes.schemeNumber", { number: applicationNumber }),
            bgColor: "#ffffff",
            color: "inherit",
          },
          {
            content: t("schemes.applicationStatus", { status: statusString }),
            bgColor:
              applicationStatus === "REJECTED"
                ? "#F8CACA"
                : applicationStatus === "SUBMITTED_SUCCESSFULLY"
                ? "#DBEFBC"
                : "#FBDCC7",
            color:
              applicationStatus === "REJECTED"
                ? "#AA1F20"
                : applicationStatus === "SUBMITTED_SUCCESSFULLY"
                ? "#435E19"
                : "#EE741E",
          },
        ].map((item, index) => (
          <Typography
            key={index}
            sx={{
              ...commonStyles,
              ...responsiveStyles,
              backgroundColor: item.bgColor,
              color: item.color,
            }}
          >
            {item.content}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

const formatTimestampIndia = (timestamp) => {
  let date;
  if (typeof timestamp === "string" && timestamp.includes("T")) {
    date = new Date(timestamp + "Z");
  } else {
    date = new Date(Number(timestamp));
  }

  if (isNaN(date.getTime())) {
    console.error("Invalid timestamp");
    return "Invalid Date";
  }

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  };

  const formattedDateTime = date.toLocaleString("en-IN", options);

  const [datePart, timePart] = formattedDateTime.split(", ");
  const timeWithoutSeconds = timePart.replace(/:\d{2}\s/, " ");

  const finalFormattedTime = `${datePart}, ${timeWithoutSeconds}`;
  return finalFormattedTime;
};
export default SchemeTrackComponent;
