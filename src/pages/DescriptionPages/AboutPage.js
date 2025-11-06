import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ImageBox } from "../MainLandingPage/Components/ImageBox";
import { AboutComponentSkeletonLoader } from "../MainLandingPage/SkeletonLoader/SkeletonLoaders";
import BasicBreadcrumbs from "../../components/BreadCrumbsBar";
import KeyContactsPage from "./KeyContactsPage";
import { useFileStoreData } from "../../Hooks/useFileStoreData";

function AboutPage({ isMobile }) {
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(
    i18n.language == "en_IN" ? "en" : "hi"
  );
  const theme = useTheme();

  useEffect(() => {
    setLanguage(i18n.language == "en_IN" ? "en" : "hi");
  }, [i18n.language]);

  const jsonUrl =
    "https://filestoragedfs.blob.core.windows.net/publicresources/json/AssistedMode/contacts.json";

  const { data, isLoading, error, revalidate } = useFileStoreData({
    url: jsonUrl,
    key: "contacts",
  });

  return (
    <Container
      variant="primary"
      style={{
        width: "100%",
        display: "flex ",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <AboutComponentSkeletonLoader />
      ) : (
        <Box className="inner-box-screen" sx={{ pb: 5 }}>
          <Box className="breadcrumbs-container" sx={{ pb: 1.5 }}>
            <BasicBreadcrumbs />
          </Box>
          <Grid container spacing={4} sx={{ alignContent: "center" }}>
            <Grid item xs={12} sm={12}>
              <Typography
                variant={isMobile ? "h3" : "h1"}
                className="AboutText pt-3 sm:pt-6 !font-bold"
              >
                {data?.["about"]?.name?.[language] ?? ""}
              </Typography>
            </Grid>
            {/* Left Text Content */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant={isMobile ? "h6" : "h4"}
                className="AboutDescription"
                color={theme.palette.text.secondary}
              >
                {data?.["about"]?.description[language]}
              </Typography>
            </Grid>

            {/* Right Images */}
            <Grid item xs={12} sm={6}>
              <Box
                className="AboutImageBox"
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  textAlign: { xs: "center", sm: "left" },
                  marginTop: { xs: 2, sm: 0 },
                }}
              >
                {(data?.CmAgriMinister?.slice(0, 2) ?? []).map((d) => (
                  <div style={{ paddingRight: "40px", paddingBottom: "10px" }}>
                    <ImageBox
                      name={d?.name[language]}
                      designation={d?.position[language]}
                      image={d?.imageUrl}
                      contact={d?.phone}
                      height={180}
                      width={180}
                    />
                  </div>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography
                variant={isMobile ? "subtitle2" : "h6"}
                className="paragraphAbout"
              >
                {data?.["about"]?.description2[language]}
                <br />
                <br /> {/* Add a line break between paragraphs */}
                {data?.["about"]?.description3[language]}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <KeyContactsPage isHomepage={false} isMobile={isMobile} />
            </Grid>

            {/* Right Images */}
            <Grid item xs={12} sm={6}></Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default AboutPage;
