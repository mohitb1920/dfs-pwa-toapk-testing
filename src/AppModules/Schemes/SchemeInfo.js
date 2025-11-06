import { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSpecificSchemeData from "../../Hooks/useSpecificSchemeData";
import {
  dispatchNotification,
  getCurrentLanguage,
} from "../../components/Utils";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import SchemeTitleHeader from "./SchemeTitleHeader";
import { useDispatch } from "react-redux";
import InteractiveElement from "../../components/InteractiveElement/InteractiveElement";

function SchemeInfo() {
  const schemeProps = [
    { id: "typeOfBenefit", value: "SCHEME_BENEFITS" },
    { id: "eligibilityCriteria", value: "eligibilityCriteria" },
    { id: "documentRequirements", value: "requiredDocuments" },
    { id: "documents", value: "documents" },
  ];

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeSchemeProp, setActiveSchemeProp] = useState(schemeProps[0].id);
  const location = useLocation();
  const navigate = useNavigate();
  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";
  const {
    mainId,
    schemeId,
    active,
    url,
    redirect,
    level,
    startDate,
    endDate,
    modifyDate,
  } = location.state || {};
  let {
    data: scheme,
    isLoading,
    refetch,
    isV1Used,
  } = useSpecificSchemeData(schemeId);

  const theme = useTheme();

  const canApply = useRef(
    localStorage.getItem("DfsWeb.isCitizenUser") === "true"
      ? localStorage.getItem("DfsWeb.hasDBTlinked") === "true"
      : true
  );

  if (!scheme || !scheme[schemeId]) {
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

  const onApplyClick = () => {
    if (redirect) {
      const confirmMessage = t("dialogContent");

      // Prompt user first, BEFORE anything else
      const confirmed = window.confirm(confirmMessage);
      if (!confirmed) return;

      try {
        const urlObj = new URL(url);
    
        // Check protocol
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
          throw new Error(`Protocol ${urlObj.protocol} not allowed`);
        }

        // Finally open the link
      } catch (error) {
        console.error("Invalid URL:", url, error);
        dispatchNotification("error", ["schemes.INVALIDURL"], dispatch);
        return;
      }
      window.open(url, "_blank");
    }
    else if (canApply.current) {
      if (!isV1Used) {
        dispatchNotification("error", ["schemes.NOFORM"], dispatch);
        return;
      }
      navigate("apply", {
        state: {
          mainId,
          schemeId,
          selectedScheme: JSON.stringify(selectedScheme["schemeName"]),
          level: level,
          startDate: startDate,
          endDate: endDate,
          active: active,
        },
      });
    } else {
      dispatchNotification("error", ["requiredRegistrationGRM"], dispatch);
    }
  };
  const handleClick = (value) => {
    setActiveSchemeProp(value);
  };

  const renderContent = () => {
    if (activeSchemeProp !== "documents") {
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
      } else {
        return <Typography>{t("schemes.documentContentEmpty")}</Typography>;
      }
    } else {
      const documents = selectedScheme[activeSchemeProp]?.["url"];

      if (documents && documents.length > 0) {
        return documents.map((doc, index) => {
          const documentUrl = doc?.["documentUrl"];
          const documentName = doc?.["documentName"]?.[language];

          return documentUrl && documentName ? (
            <Link
              key={index}
              href={documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="green"
              underline="none"
            >
              <Typography
                sx={{
                  color: "green",
                  "&:hover": {
                    color: "blue",
                    textDecoration: "underline",
                  },
                }}
              >
                {documentName}
              </Typography>
            </Link>
          ) : (
            <Typography>{t("schemes.documentContentEmpty")}</Typography>
          );
        });
      } else {
        return <Typography>{t("schemes.documentContentEmpty")}</Typography>;
      }
    }
  };
  return (
    <Container variant="primary">
      <Box className="schemes-page">
        <Box className="breadcrumbs-container">
          <BasicBreadcrumbs />
        </Box>
        <Box className="scheme-details-main">
          <Box className="scheme-details-container">
            <SchemeTitleHeader
              schemeId={schemeId}
              level={level}
              scheme={selectedScheme["schemeName"]}
              language={language}
              startDate={startDate}
              endDate={endDate}
              modifyDate={modifyDate}
              active={active}
            />
            <Box
              sx={{
                height: "fit-content",
              }}
              className="scheme-apply-button"
            >
              <Button
                onClick={onApplyClick}
                className="!px-10 !py-3 whitespace-nowrap"
                variant="primary"
                disabled={!active}
              >
                {t("schemes.schemeApplyNow")}
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
            </Box>
            <Container variant="tertiaryGreen" className="!p-0">
              <Box className="scheme-details-scheme-info">
                <Box className="scheme-info-tabs">
                  {schemeProps.map((prop, index) => {
                    return (
                      <InteractiveElement
                        key={prop.value}
                        onClick={() => handleClick(prop.id)}
                      >
                        <Box
                          className={`scheme-info-tab ${
                            prop.id === activeSchemeProp
                              ? "scheme-info-tab-active"
                              : ""
                          }`}
                          bgcolor={
                            prop.id === activeSchemeProp
                              ? theme.palette.background.primaryGreen
                              : theme.palette.background.default
                          }
                        >
                          <img
                            src={`${window.contextPath}/assets/${theme.palette.mode}/${prop.value}.svg`}
                            alt="logos"
                            style={
                              prop.id === activeSchemeProp
                                ? { filter: "invert(1)" }
                                : {}
                            }
                          />
                          <Typography
                            variant="subtitle2"
                            className={`scheme-info-tab-text ${
                              prop.id === activeSchemeProp
                                ? "scheme-info-tab-text-active"
                                : ""
                            }`}
                          >
                            {t(prop.value)}
                          </Typography>
                        </Box>
                      </InteractiveElement>
                    );
                  })}
                </Box>
                <Box
                  className="scheme-info-content"
                  bgcolor={theme.palette.background.default}
                >
                  <Box className="flex gap-2 items-center">
                    <img
                      src={`${window.contextPath}/assets/${theme.palette.mode}/${activeSchemeProp}-wrap.svg`}
                      alt="logos"
                      style={{}}
                    />
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
}

export default SchemeInfo;
