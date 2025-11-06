import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";
import { ImageCarouselComponent } from "../MainLandingPage/Components/ImageCarouselComponent";
import { Updates } from "../MainLandingPage/Components/Updates";
import { SchemesComponent } from "../MainLandingPage/Components/SchemesComponent";
import AssetsHome from "../MainLandingPage/Components/AssetsHome";
import MediaSection from "../MainLandingPage/Components/MediaSection";
import QuicAction from "../MainLandingPage/Components/QuicAction";
import FAQSection from "../MainLandingPage/Components/FAQSection";
import { useTranslation } from "react-i18next";
import { homePageImages, TENANT_ID } from "../../components/Utils";
import { useLocalizationStore } from "../../Hooks/Store";

function AgentHomePage({ loggedIn }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  const stateCode = TENANT_ID;
  const moduleCode = ["dfs-schemes"];
  const isAgentUser = localStorage.getItem("DfsWeb.isAgentUser") === "true";
  const isLoggedIn = localStorage.getItem("DfsWeb.isLoggedIn") === "true";
  const isMobile = useMediaQuery("(max-width:640px)");
  const isCitizenUser = localStorage.getItem("DfsWeb.isCitizenUser") === "true";

  const { data } = useLocalizationStore({
    stateCode,
    moduleCode,
    language: i18n.language,
  });

  return (
    <>
      <Box>
        <Box
          className="flex justify-end w-full"
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          <ImageCarouselComponent
            showPlayPause={true}
            images={homePageImages}
            height={"none"}
            borderRadius={"0px"}
          />
        </Box>

        <Updates t={t} language={language} isMobile={isMobile} />
        <Box className="mt-8 sm:mt-0">
          <AssetsHome language={language} t={t} />
        </Box>
        {(!isLoggedIn || isAgentUser || isCitizenUser) && (
          <SchemesComponent isMobile={isMobile} />
        )}
        {isAgentUser && (
          <QuicAction t={t} language={language} isMobile={isMobile} />
        )}
        <MediaSection t={t} language={language} isMobile={isMobile} />
        <FAQSection
          t={t}
          language={language}
          isHomeScreen={true}
          isMobile={isMobile}
        />
      </Box>
    </>
  );
}

AgentHomePage.propTypes = {
  loggedIn: PropTypes.bool,
};

export default AgentHomePage;
