import React, { useEffect, useState } from "react";
import { About } from "./Components/About";
import { Updates } from "./Components/Updates";
import { SchemesComponent } from "./Components/SchemesComponent";
import AnalyticsComponent from "./Components/AnalyticsComponent";
import FAQSection from "./Components/FAQSection";
import MediaSection from "./Components/MediaSection";
import NewsAndSocialSection from "./Components/NewsAndSocialSection";
import { useTranslation } from "react-i18next";
import { LoginComponent } from "./Components/NewLoginComponent";
import { useNavigate } from "react-router-dom";
import AssetsHome from "./Components/AssetsHome";

const MainLandingPage = ({ isMobile }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );

  useEffect(() => {
    if (localStorage.getItem("DfsWeb.isLoggedIn") === "true") {
      navigate(`${window.contextPath}/home`);
    }
  }, []);

  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  return (
    <>
      <LoginComponent />
      <Updates t={t} language={language} isMobile={isMobile} />
      <About t={t} language={language} isMobile={isMobile} />
      <AssetsHome language={language} t={t} />
      <SchemesComponent isMobile={isMobile} />
      <NewsAndSocialSection t={t} language={language} isMobile={isMobile} />
      {/* <OurOfferingComponent t={t} language={language} /> */}
      <AnalyticsComponent language={language} t={t} />
      <MediaSection t={t} language={language} isMobile={isMobile} />
      <FAQSection
        t={t}
        language={language}
        isHomeScreen={true}
        isMobile={isMobile}
      />
    </>
  );
};

export default MainLandingPage;
