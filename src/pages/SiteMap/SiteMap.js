import React, { useMemo, useState } from "react";
import "../../styles/SiteMap.css";
import { Box, Container, Link, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowRightDottedIcon } from "../../assets/arrow-right-dotted.svg";
import { ReactComponent as ArrowDownDottedIcon } from "../../assets/arrow-down-dotted.svg";
import { ReactComponent as ArrowRightIcon } from "../../assets/arrow-right.svg";
import { siteMapData } from "./SitemapData";
import {
  agentAccess,
  announcementsAccess,
  dashboardAccess,
  grmAccess,
  kccUser,
  toQueryString,
} from "../../components/Utils";
import UrlDialog from "../../components/dialog/UrlDialog";
import useUrlDialog from "../../Hooks/useUrlDialog";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";

function SiteMap() {
  const [collapse, setCollapse] = useState({});
  const { t } = useTranslation();
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === "dark";
  const isAgent = agentAccess();
  const isGrmEmployee = grmAccess();
  const isAncEmployee = announcementsAccess();
  const isKccUser = kccUser();
  const isDashboardAdmin = dashboardAccess();
  const isLoggedIn = localStorage.getItem("DfsWeb.isLoggedIn") === "true";

  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();

  const handleClick = (event, site) => {
    if (site?.link) {
      handleLinkClick(site.link, event);
    }
    if (window.location.href.includes(site?.url)) {
      event.preventDefault();
    }
    if (site?.url === "sitemap") {
      const mainContent = document.getElementById(site.title);
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: "smooth" });
        if (
          [
            "ImportantLinks",
            "OtherImportantLinks",
            "ContactInformation",
            "BiharKrishiSupport",
            "KisanCallCentre",
          ].includes(site.title)
        ) {
          mainContent.classList.add("sitemap-highlight");
          setTimeout(() => {
            mainContent.classList.remove("sitemap-highlight");
          }, 1000);
        }
      }
    }
  };

  const handleCollapseClick = (section) => {
    if (collapse?.[section]) {
      const temp = { ...collapse };
      delete temp[section];
      setCollapse(temp);
    } else {
      setCollapse({ ...collapse, [section]: true });
    }
  };

  const siteData = useMemo(
    () =>
      siteMapData({
        isAgent,
        isLoggedIn,
        isGrmEmployee,
        isAncEmployee,
        isKccUser,
        isDashboardAdmin,
      }),
    [
      isLoggedIn,
      isAgent,
      isGrmEmployee,
      isAncEmployee,
      isKccUser,
      isDashboardAdmin,
    ]
  );

  return (
    <Container variant="primary">
      <Box className="sitemap-page-layout">
        <Box className="breadcrumbs-container mb-[24px]">
          <BasicBreadcrumbs />
        </Box>
        <Typography variant="h1" className="sitemap-header">
          {t("Sitemap")}
        </Typography>
        <Box className="sitemap-sections-container">
          {siteData?.map((section) => (
            <Box key={section.sectionHeader}>
              <Box
                className="sitemap-section-header"
                onClick={() => handleCollapseClick(section.sectionHeader)}
              >
                {collapse?.[section.sectionHeader] ? (
                  <ArrowRightDottedIcon />
                ) : (
                  <ArrowDownDottedIcon />
                )}{" "}
                <Typography
                  variant="h5"
                  className="sitemap-section-header-text"
                >
                  {t(section.sectionHeader)}
                </Typography>
              </Box>
              {!collapse?.[section.sectionHeader] && (
                <Box className="sitemap-sub-section">
                  {section.sectionRoutes.map((mapItem) => {
                    const queryString = toQueryString(mapItem?.state ?? {});
                    const targetUrl = mapItem?.url
                      ? `${window.contextPath}/${mapItem.url}?${queryString}`
                      : null;
                    return (
                      <Box className="sitemap-subsection-item">
                        <Box className="sitemap-right-arrow-text-container">
                          <ArrowRightIcon
                            className={isDarkTheme ? "white-arrow-icon" : ""}
                          />
                          <Link
                            href={targetUrl}
                            onClick={(event) => handleClick(event, mapItem)}
                            underline="none"
                          >
                            <Typography
                              variant="subtitle1"
                              className="sitemap-subsection-header"
                            >
                              {t(mapItem.title)}
                            </Typography>
                          </Link>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        <UrlDialog
          open={open}
          externalUrl={externalUrl}
          handleClose={handleClose}
          t={t}
        />
      </Box>
    </Container>
  );
}

export default SiteMap;
