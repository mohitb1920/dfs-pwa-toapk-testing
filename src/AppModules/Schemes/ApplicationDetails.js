import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import SchemeTitleHeader from "./SchemeTitleHeader";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  dispatchNotification,
  getCurrentLanguage,
} from "../../components/Utils";
import { useTheme } from "@mui/styles";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import { Autorenew, SaveAlt } from "@mui/icons-material";
import { SchemeService } from "../../services/Schemes";
import { useDispatch } from "react-redux";
import { useLocalizationStore } from "../../Hooks/Store";
import { useSpecificApplicationStatus } from "../../Hooks/useSpecificApplicationStatus";

const schemeProps = [
  { id: "remarks", value: "remarks" },
  { id: "typeOfBenefit", value: "SCHEME_BENEFITS" }, // change it to scheme details
];

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const [activeSchemeProp, setActiveSchemeProp] = useState(schemeProps[0].id);
  // const [isRefreshing, setIsRefreshing] = useState(false);
  const location = useLocation();
  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";
  const theme = useTheme();
  const dispatch = useDispatch();

  const { mainId, schemeId, level, applicationId, active, remark, applicationDetails } =
    location.state || {};
  let { data: scheme, isLoading, refetch } = useSpecificSchemeData(schemeId);
  const { mutate, isLoading: isRefreshing } = useSpecificApplicationStatus();

  const [applicationRemarks, setApplicationRemarks] = useState(remark);
  const [application,setApplication] = useState(applicationDetails);

  useLocalizationStore({
    stateCode: "br",
    moduleCode: "dfs-scheme-remarks",
    language: languagef
  });

  if (!scheme?.[schemeId]) {
    return (
      <Box
        display="flex"
        justifyContent={"center"}
        alignItems="center"
        height="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  const selectedScheme = scheme[schemeId][0];

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
      const response = await SchemeService.schemeReceipt(data, applicationId);
      if (response) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const downloadUrl = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `scheme_receipt_${applicationId}.pdf`; // Customize file name
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

  const handleClick = (value) => {
    setActiveSchemeProp(value);
  };

  const handleRefresh = () => {
    mutate(applicationId,{onSuccess: (updatedApplication) =>{
      setApplicationRemarks(updatedApplication.remark)
      setApplication(updatedApplication);
    }});
  }

  const renderContent = () => {
    const content = selectedScheme[activeSchemeProp]?.[language];
    if (content && content.length > 0) {
      return content.map((data, index) => (
        <Box key={index} className="flex items-start space-x-2">
          <Typography variant="h6" color={theme.palette.text.primary}>
            {`${index + 1}.`}
          </Typography>
          <Typography variant="h6" color={theme.palette.text.primary}>
            {data.replace(/^([१२३४५६७८९०0-9]+\.\s*)/, "")}
          </Typography>
        </Box>
      ));
    } else if (activeSchemeProp === "remarks"){
      let remarkKey = applicationRemarks;
      let remark = t(remarkKey);
      let approvingAuthority = "";
      if(applicationRemarks.toLowerCase().includes("pending at")){ 
        remarkKey = "Pending";
        approvingAuthority = applicationRemarks.substring(10,applicationRemarks.length).trim();
        remark = t(remarkKey, { approvingAuthority })
      }
      if (applicationRemarks.toLowerCase().includes("rejected at")) {
        remarkKey = "Rejected";
        approvingAuthority = applicationRemarks.substring(11, applicationRemarks.length).trim();
        remark = t(remarkKey, { approvingAuthority })
      }
      remark = remark.replace(/{Approving authority}|{अनुमोदन प्राधिकारी}/g, approvingAuthority);
      return  (
        <Box className="flex items-start space-x-2">
          <Typography variant="h6" color={theme.palette.text.primary}>
            {remark}
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Container variant="primary">
      <Box className="schemes-page">
        <Box className="breadcrumbs-container">
          <BasicBreadcrumbs />
        </Box>
        <Box className="scheme-details-main relative">
          <Box className="scheme-details-container">
            <SchemeTitleHeader
              schemeId={schemeId}
              level={level}
              scheme={selectedScheme["schemeName"]}
              language={language}
              active={active}
              department={selectedScheme["subDepartmentName"]}
            />
            <Box
              sx={{
                height: "fit-content",
                "@media (min-width:801px)": {
                  position: "absolute",
                  right: "0px"
                },
              }}
              className="scheme-apply-button"
            >
              <Button
                onClick={handleDownload}
                className="whitespace-nowrap !mr-4"
                variant="secondary"
              >
                <SaveAlt className="mr-2" />
                {t("Download")}
              </Button>
              <Button
                onClick={handleRefresh}
                className="whitespace-nowrap"
                variant="secondary"
                disabled={isRefreshing}
              >
                {isRefreshing ? <CircularProgress size={28}/> : (<><Autorenew className="mr-2" /> {t("Refresh")}</>)}
              </Button>
            </Box>
          </Box>
          <Box
            className="scheme-details-content"
            sx={{ display: { xs: "block" } }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                rowGap: "24px",
                padding: "24px 0",
              }}
            >
              <Typography
                variant="h3"
                className="scheme-details-about-banner"
                color={theme.palette.text.primary}
              >
                {t("schemes.schemeAbout")}
              </Typography>

              <Typography variant="h6" color={theme.palette.text.primary}>
                {selectedScheme["shortDescription"][language]}
              </Typography>
              <Box className="flex gap-1">
                <Typography variant="h6" fontWeight={600}>
                  {`${t("APPLICATION_STATUS")}: `}
                </Typography>
                <StatusChip status={application?.status} t={t}/>
              </Box>
              <Box className="flex gap-1">
                <Typography variant="h6" fontWeight={600}>
                  {`${t("agentTrack.SCHEME_TICKET_NUMBER")}: `}
                </Typography>
                <Typography variant="h6">{application?.sourceApplicationId}</Typography>
              </Box>
              <Box className="flex gap-1">
                <Typography variant="h6" fontWeight={600}>
                  {`${t("Date_of_Application")}: `}
                </Typography>
                <Typography variant="h6">
                  {formatTimestampIndia(application?.schemeApplication?.appliedDate)}
                </Typography>
              </Box>
            </Box>
            <Container variant="tertiaryGreen" className="!p-0">
              <Box className="scheme-details-scheme-info">
                <Box className="scheme-info-tabs">
                  {schemeProps.map((prop, index) => {
                    return (
                      <Box
                        className={`scheme-info-tab ${prop.id === activeSchemeProp
                            ? "scheme-info-tab-active"
                            : ""
                          }`}
                        key={prop.value}
                        onClick={() => handleClick(prop.id)}
                        bgcolor={
                          prop.id === activeSchemeProp
                            ? theme.palette.background.primaryGreen
                            : theme.palette.background.default
                        }
                      >
                        <Typography
                          variant="subtitle2"
                          className={`scheme-info-tab-text ${prop.id === activeSchemeProp
                              ? "scheme-info-tab-text-active"
                              : ""
                            }`}
                        >
                          {t(prop.value)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                <Box
                  className="scheme-info-content"
                  bgcolor={theme.palette.background.default}
                >
                  <Box className="flex gap-2 items-center">
                    <Typography
                      variant="h3"
                      className="scheme-info-title"
                      color={theme.palette.text.textGreen}
                    >
                      {t(
                        schemeProps.find((prop) => prop.id === activeSchemeProp)
                          ?.value
                      )}
                    </Typography>
                  </Box>
                  <Box className="flex flex-col gap-1.5">{renderContent()}</Box>
                </Box>
              </Box>
            </Container>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ApplicationDetails;

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
    <Box sx={{ display: "inline", columnGap: "4px" }}>
      <Typography  className={styleClass}>
        {t(status)}
      </Typography>
    </Box>
  );
};
