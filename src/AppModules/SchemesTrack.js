import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { SchemeService } from "../services/Schemes";
import { dispatchNotification } from "../components/Utils";
import { useDispatch } from "react-redux";
import useSchemesData from "../Hooks/useSchemesData";
import CustomButton from "../components/Button/CustomButton";
import { ButtonColor } from "../components/Button/ButtonEnums";

function SchemesTrack({ data, handleService, isMobile }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  let { data: schemes, isLoading } = useSchemesData({});
  if (isLoading) return <CircularProgress color="success" />;
  const matchedScheme = schemes.find((scheme) => scheme.id === data.mdmsId);
  const language = i18n.language === "hi_IN" ? "hi" : "en";
  const handleDownload = async () => {
    try {
      const requestdata = {
        RequestInfo: {
          ts: 0,
          action: "string",
          did: "string",
          key: "string",
          msgId: "string",
          requesterId: "string",
        },
      };

      const response = await SchemeService.schemeReceipt(
        requestdata,
        data?.dfsSchemeApplicationId
      );
      if (response) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `scheme_receipt_${data?.dfsSchemeApplicationId}.pdf`; // Customize file name
        link.click(); // Trigger download

        window.URL.revokeObjectURL(downloadUrl);
      } else {
        throw new Error(
          response?.data?.Errors?.[0]?.code || "File Not Downloaded"
        );
      }
    } catch (error) {
      dispatchNotification("error", [error.message], dispatch);
    }
  };

  const statusStyle = {
    content: t("schemes.applicationStatus", { status: t(data?.status) }),
    bgColor:
      data?.status === "REJECTED"
        ? "#F8CACA"
        : data?.status === "SUBMITTED_SUCCESSFULLY"
        ? "#DBEFBC"
        : "#FBDCC7",
    color:
      data?.status === "REJECTED"
        ? "#AA1F20"
        : data?.status === "SUBMITTED_SUCCESSFULLY"
        ? "#435E19"
        : "#EE741E",
  };
  return (
    <Box className="container-card max-sm:!gap-y-4">
      <Box className="scheme-track-header">
        <Box className="scheme-track-status">
          <Typography
            variant={isMobile ? "h5" : "h2"}
            color={theme.palette.text.primary}
            className="!font-bold"
          >
            {t("schemeTrack.SCHEMES_TRACK")}
          </Typography>
          <Box className="">
            {[statusStyle].map((item, index) => (
              <Typography
                key={index}
                variant="subtitle2"
                className="scheme-track-status-text"
                sx={{
                  backgroundColor: item.bgColor,
                  color: item.color,
                }}
              >
                {item.content}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box className="scheme-track-scheme-details">
          <Box className="flex flex-wrap">
            <Typography
              variant={isMobile ? "subtitle2" : "h6"}
              className="scheme-track-details-info break-all"
              color={theme.palette.text.textGrey}
            >
              {matchedScheme["schemeName"][`title-${language}`]}
            </Typography>
          </Box>
          {!isMobile && <Box className="scheme-track-details-info-separator" />}
          <Typography
            variant={isMobile ? "subtitle2" : "h6"}
            className="scheme-track-details-info whitespace-nowrap"
            color={theme.palette.text.textGrey}
          >
            {t("schemes.schemeCreated", {
              date: formatTimestampIndia(data?.schemeApplication?.appliedDate),
            })}
          </Typography>
        </Box>
      </Box>
      <Box className="scheme-track-header-actions">
        <Typography
          variant={isMobile ? "subtitle2" : "h3"}
          className="!font-bold"
          color={theme.palette.text.textGreen}
        >
          {data?.dfsSchemeApplicationId}
        </Typography>
        <CustomButton
          color={ButtonColor.SECONDARY}
          variant="outlined"
          noHover
          onClick={handleDownload}
          sx={{ color: "black", borderColor: "black", fontSize: "1rem" }}
        >
          {t("COMMON_DOWNLOAD")}
        </CustomButton>
      </Box>
      <Box className="grm-form-inner-cards-container">
        <Box
          sx={{
            padding: "12px 16px",
            backgroundColor: theme.palette.background.default,
            borderRadius: "16px",
          }}
        >
          <Box
            className="scheme-details-content"
            sx={{ display: { xs: "block" } }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "24px",
              }}
            >
              <Typography
                variant={isMobile ? "h6" : "h3"}
                className="scheme-details-about-banner"
                color={theme.palette.text.primary}
              >
                {t("schemes.schemeAbout")}
              </Typography>

              <Typography
                variant={isMobile ? "subtitle2" : "h6"}
                color={theme.palette.text.primary}
              >
                {matchedScheme?.["shortDescription"][language]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="flex justify-end">
        <Button
          variant="primary"
          className="!font-semibold"
          onClick={() => handleService({})}
          size="medium"
        >
          {t("COMMON_DONE")}
        </Button>
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

  const finalFormattedTime = `${datePart} | ${timeWithoutSeconds}`;
  return finalFormattedTime;
};

export default SchemesTrack;
