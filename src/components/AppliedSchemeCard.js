import { Autorenew, SaveAlt } from "@mui/icons-material";
import { Box, Button, ButtonBase, CircularProgress, Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import TitleWithTooltip from "./TruncatedTitle";
import { SchemeService } from "../services/Schemes";
import { dispatchNotification } from "./Utils";
import { useDispatch } from "react-redux";
import { useSpecificApplicationStatus } from "../Hooks/useSpecificApplicationStatus";

const AppliedSchemeCard = ({
  scheme,
  language,
  onClick,
  isMobile,
  schemeData,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { mutate, isLoading, error } = useSpecificApplicationStatus();

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "assets/SchemeLogos/other_schemes.png";
  };

  const handleDownload = async () => {
    try {
      const data = {
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
        data,
        scheme?.dfsSchemeApplicationId
      );
      if (response) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `scheme_receipt_${scheme?.dfsSchemeApplicationId}.pdf`; // Customize file name
        link.click(); // Trigger download

        // Clean up
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

  const handleApplicationUpdate = () => {
    mutate(scheme?.dfsSchemeApplicationId);
  };

  return (
    <Box className="applied-scheme-card">
      <Box className="flex gap-3 pb-1">
        <Box
          component="img"
          className="applied-schemes-page-card-logo"
          alt="Scheme logo"
          src={`assets/SchemeLogos/${scheme.mdmsId}.svg`}
          onError={handleImageError}
        />
        <Box>
          <StatusChip status={scheme.status} t={t}/>
          <TitleWithTooltip
            className="schemes-page-card-title"
            color="textSecondary"
            textAlign="left"
            title={t(
              schemeData?.schemeName[`title-${language}`] ||
                schemeData?.schemeName[`title`]
            )}
            language={language}
            // title={scheme?.schemeApplication?.schemeName}
          />
        </Box>
        <Box className="ml-auto">
          <ButtonBase onClick={handleDownload}>
            <SaveAlt
              sx={{ color: theme.palette.text.secondary, width: "21.34px" }}
            />
          </ButtonBase>
        </Box>
      </Box>
      <Divider />
      {/* below component might require loop and span */}
      <Box className="flex flex-col gap-1 py-1">
        <Typography
          className="schemes-page-card-level"
          variant="body2"
          color={theme.palette.text.textGrey}
        >
          {t(schemeData?.subDepartmentName[language])}
        </Typography>
        <Box className="flex gap-1">
          <Typography variant="subtitle2">{`${t(
            "agentTrack.SCHEME_TICKET_NUMBER"
          )}: `}</Typography>
          <Typography>{scheme?.sourceApplicationId}</Typography>
        </Box>
        <Box className="flex gap-1">
          <Typography variant="subtitle2">{`${t(
            "Date_of_Application"
          )}: `}</Typography>
          <Typography>
            {formatTimestampIndia(scheme?.schemeApplication?.appliedDate)}
          </Typography>
        </Box>
      </Box>
      <Box className="flex justify-end gap-4">
        <Button variant="secondary" disabled={isLoading} onClick={handleApplicationUpdate}>
          {isLoading ? <CircularProgress size={28}/>:<><Autorenew className="mr-2" /> {t("Refresh")}</>}
        </Button>
        <Button variant="secondary" onClick={() => onClick(scheme)}>
          {t("ViewDetails")}
        </Button>
      </Box>
    </Box>
  );
};

export default AppliedSchemeCard;

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
  };

  const formattedDateTime = date.toLocaleString("en-IN", options);

  const [datePart] = formattedDateTime.split(", ");

  const finalFormattedTime = `${datePart}`;
  return finalFormattedTime;
};

const StatusChip = ({ status,t }) => {
  let styleClass = "applied-scheme-card-pending";
  if (["ACCEPTED", "APPROVED"].includes(status)) {
    styleClass = "applied-scheme-card-approved";
  } else if (
    ["FAILED", "REJECTED", "SUBMISSION_ERROR", "SYSTEM_ERROR"].includes(status)
  ) {
    styleClass = "applied-scheme-card-rejected";
  }

  return (
    <Box sx={{ display: "flex", columnGap: "4px" }}>
      <Typography variant="h7" className={styleClass}>
        {t(status)}
      </Typography>
    </Box>
  );
};
