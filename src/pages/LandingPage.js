import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Avatar, Box, Button, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getRoleBasedModules } from "../components/Utils";
import InteractiveElement from "../components/InteractiveElement/InteractiveElement";

const ColorButton = styled(Button)(() => ({
  width: "100%",
  fontSize: "15px",
  fontWeight: "700",
  textTransform: "none",
  borderRadius: 0,
  color: "#fff",
  backgroundColor: "#343434",
  "&:hover": {
    backgroundColor: "#000",
    color: "#fff",
  },
}));

function LandingPage({ loggedIn }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("DfsWeb.user-info"));
  const modules = getRoleBasedModules();

  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  return (
    <Container variant="white">
      <Box className="mb-20">
        <Box className="banner-container">
          <Box className="banner-text-container">
            <Typography className="banner-header-1" variant="h1">
              {t("DFSWEB_WELCOME")}
            </Typography>
            <Typography className="banner-header-2">
              {userInfo?.name}
            </Typography>
            <Typography className="banner-text" variant="subtitle2">
              {t("DFSWEB_BANNER_TEXT")}
            </Typography>
          </Box>
          <Box className="banner-logo-container">
            <Avatar
              alt="banner-logo"
              src={`${window.contextPath}/assets/banner-image.png`}
              sx={{ height: "300px", width: "300px" }}
            ></Avatar>
          </Box>
        </Box>
        <Container variant="tertiaryGreen">
          <Box className="features-container">
            <Typography className="community-header" variant="h5">
              {t("MANAGE_COMMUNITY_HEADER")}
            </Typography>
            <Box className="features-listing">
              {modules
                ?.filter((module) => module?.card)
                ?.map((item) => (
                  <InteractiveElement onClick={() => navigate(item.path)}>
                    <Box
                      className="feature"
                      key={item.title}
                      data-testid="feature-card"
                    >
                      <Avatar
                        alt={`${item.title}`}
                        src={`${window.contextPath}/assets/${item.icon}.png`}
                        className="feature-logo"
                      ></Avatar>
                      <Typography className="feature-header">
                        {t(item.title)}
                      </Typography>
                      <Typography className="feature-description">
                        {t(item.description)}
                      </Typography>
                    </Box>
                  </InteractiveElement>
                ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Container>
  );
}

LandingPage.propTypes = {
  loggedIn: PropTypes.bool,
};

export default LandingPage;
