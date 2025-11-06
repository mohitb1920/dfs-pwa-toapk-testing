import React, { useEffect, useRef, useState } from "react";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { Box, Container, Grid, Typography } from "@mui/material";
import Sidebar from "./Components/SideBar";
import ContentDisplay from "./Components/ContentDisplay";
import privacyPolicyDataEnglish from "./privacypolicyEnglish.json";
import privacyPolicyDataHindi from "./privacypolicyHindi.json";
import { useTranslation } from "react-i18next";
import "./Styles/PrivacyPolicyStyles.css";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";

function PrivacyPolicyPage({ isMobile }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  const [privacyPolicyData, setsrivacyPolicyData] = useState(
    language == "hi" ? privacyPolicyDataHindi : privacyPolicyDataEnglish
  );
  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  const [selectedSection, setSelectedSection] = useState(0);
  const handleClick = (id) => {
    setSelectedSection(id);
  };
  useEffect(() => {
    setsrivacyPolicyData(
      language == "hi" ? privacyPolicyDataHindi : privacyPolicyDataEnglish
    );
  }, [language]);

  const sectionRefs = useRef([]);

  return (
    <Container variant="primary">
      <Box>
        <Box className="inner-box-screen m-auto">
          <Box className="breadcrumbs-container pb-6 sm:pb-10">
            <BasicBreadcrumbs />
          </Box>
          <Box className="header-Assets">
            <Box className="flex items-center justify-center">
              <PolicyOutlinedIcon fontSize={isMobile ? "medium" : "large"} />
              {/* <img src={`${window.contextPath}/assets/policy.svg`} /> */}
              <Typography
                className="scheme-header-name"
                variant={isMobile ? "h5" : "h2"}
                sx={{
                  whiteSpace: "noWrap",
                  ml: "16px",
                }}
              >
                {t("Policy")}
              </Typography>
            </Box>
          </Box>
          <Box className="pp_bodycontainer">
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Sidebar
                  sections={privacyPolicyData.privacyPolicy}
                  handleClick={handleClick}
                  selectedSection={selectedSection}
                  t={t}
                />
              </Grid>
              <Grid item xs={12} md={8} className="overrideMaxWidth">
                <ContentDisplay
                  sections={privacyPolicyData.privacyPolicy}
                  sectionRefs={sectionRefs}
                  selectedSection={selectedSection}
                  isMobile={isMobile}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default PrivacyPolicyPage;
