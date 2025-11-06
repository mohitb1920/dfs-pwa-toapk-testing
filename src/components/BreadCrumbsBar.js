import * as React from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { useLocation, Link as RouterLink, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from "react-i18next";
import { Container, useTheme } from "@mui/material";

export default function BasicBreadcrumbs(props) {
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const isCitizen = localStorage.getItem("DfsWeb.isCitizenUser") === "true";

  let pathnames = location.pathname.split("/").filter((x) => x);
  if (["dashboards"].some((path) => pathnames?.includes(path))) {
    pathnames.shift();
  }
  if (!window?.contextPath) {
    pathnames = ["home", ...pathnames];
  }
  if (props?.trackScheme && props?.trackScheme?.length === 1) {
    pathnames = [...pathnames, ...props.trackScheme];
  }
  if (["complaintdetails", "inbox"].some((path) => pathnames?.includes(path))) {
    pathnames.splice(-1);
  }
  const navigate = useNavigate();
  const getLabel = (segment, index) => {
    if (index === 0) return t("DFSWEB_HOME");
    if (segment === "schemes") return t("schemes.allschemes");
    if (segment === "details") return t("schemes.schemeDetails");
    if (segment === "apply") return t("schemes.apply");
    if (segment === "grm-create") return t("agentGrm.GRM");
    if (segment === "grm-application") return t("agentGrm.GRM_APPLICATION");
    if (segment === "registration") return t("AGENT_FARMER_REGISTRATIONS");
    if (segment === "faq") return t("DFSWEB_FAQs");
    if (segment === "key-contacts") return t("KeyContacts");
    if (segment === "about-section") return t("DFSWEB_About_Bihar");
    if (segment === "assets-section") return t("DFSWEB_ASSETS");
    if (segment === "assets-details") return t("DFSWEB_ASSETS_details");
    if (segment === "application-details") return t("Applied_Schemes");
    if (segment === "farmer-registration") return t("Farmer_Registration");
    return t(segment.charAt(0).toUpperCase() + segment.slice(1));
  };

  let state = {};
  const handleNavigation = (routeTo, state) => {
    const isOnApplyPage = pathnames.includes("apply");
    const isTrackSchemePage = pathnames.includes("trackScheme");
    if (isOnApplyPage) {
      const confirmNavigation = window.confirm(
        !isCitizen ? t("schemes.confirmNavigation") :
          "Are you sure you want to leave the application page?"
      );
      if (confirmNavigation) {
        navigate(routeTo, { state });
      }
    } else if (isTrackSchemePage) {
      props.handleService({});
    } else {
      navigate(routeTo, { state });
    }
  };
  return (
    <div role="presentation">
      <Container variant="tertiaryGreen" className="!px-0 !rounded-lg">
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={
            <NavigateNextIcon
              fontSize="small"
              sx={{ color: "rgba(92, 100, 96, 1)" }}
            />
          }
          sx={{
            padding: "4px 8px 4px 8px",
            borderRadius: "8px",
            fontFamily: "Inter",
          }}
        >
          {pathnames.map((segment, index) => {
            const isLast = index === pathnames.length - 1;
            let startIndex = 0;
            if (!window.contextPath) {
              startIndex = pathnames?.length > 2 ? 1 : 0;
            }
            let routeTo = `/${pathnames
              .slice(startIndex, index + 1)
              .join("/")}`;
            if (routeTo === "/grm") {
              routeTo = "/grm/inbox";
            }
            if (segment === "details")
              state = {
                schemeId: props.schemeId,
                level: props.level,
                startDate: props.startDate,
                endDate: props.endDate,
                active: props.active,
                mainId: props.mainSchemeId,
              };
            return isLast ? (
              <Typography
                key={routeTo}
                color={
                  isDarkTheme
                    ? `${theme.palette.text.textGreen}`
                    : `${theme.palette.text.primary}`
                }
              >
                {getLabel(segment, index)}
              </Typography>
            ) : (
              <Link
                key={routeTo}
                underline="hover"
                component={RouterLink}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(routeTo, state);
                }}
                className="font-medium"
                color={
                  isDarkTheme
                    ? `${theme.palette.text.primary}`
                    : `${theme.palette.text.textGreen}`
                }
              >
                {getLabel(segment, index)}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Container>
    </div>
  );
}
