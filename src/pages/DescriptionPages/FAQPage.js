import React, { useEffect, useState } from "react";
import FAQSection from "../MainLandingPage/Components/FAQSection";
import { useTranslation } from "react-i18next";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import { Box, Container } from "@mui/material";

function FAQPage({ isMobile }) {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );

  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  return (
    <Container variant="primary" sx={{ overflow: "auto" }}>
      <Box className="inner-box-screen m-auto">
        <Box className="breadcrumbs-container px-0 sm:px-4" sx={{ pb: "24px" }}>
          <BasicBreadcrumbs />
        </Box>
        <FAQSection
          t={t}
          language={language}
          isHomeScreen={false}
          variant="h1"
          isMobile={isMobile}
        />
      </Box>
    </Container>
  );
}

export default FAQPage;
