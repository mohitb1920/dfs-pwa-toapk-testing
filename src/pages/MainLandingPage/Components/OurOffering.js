import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { OurOfferingSkeletonLoader } from "../SkeletonLoader/SkeletonLoaders.js";
import "../Styles/OurOffering.css";
import OurOffering from "./OurOffering.json"; // Adjust path to your file
import { useTranslation } from "react-i18next";
import { getCurrentLanguage } from "../../../components/Utils.js";
import CustomButton from "../../../components/Button/CustomButton.js";
import { CommonCard } from "../../../components/cards/CommonCard.js";

const OurOfferingComponent = ({ t, language }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      // fetch("/content.json") // Load JSON data
      //   .then((res) => res.json())
      //   .then((data) => {
      setServices(OurOffering["OurOffering"]);
      setLoading(false);
      // });
    }, 20);
  }, []);

  return (
    <Box className="main-container">
      <Box className="secondary-container inner-box-screen2" sx={{}}>
        <Box
          sx={{
            flex: 1,
            marginRight: 0,
            marginBottom: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              textAlign: "center",
            }}
          >
            {t("OurOfferings")}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ flex: 2 }} alignItems="stretch">
          {loading
            ? [1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <OurOfferingSkeletonLoader />
                </Grid>
              ))
            : services.slice(0, 3).map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <CommonCard
                    description={service[language].description}
                    value={service[language].header}
                    image={service.image}
                    icon={false}
                    backgroundColor="white"
                    color="var(--Neutral-neutral-800, rgba(28, 33, 30, 1))"
                    headerColor="#1A5C4B"
                    isEnabled={service.isEnabled}
                    align="start"
                    contentHeight="208px"
                    justifyContent="start"
                  />
                </Grid>
              ))}
        </Grid>
        {/* <Box textAlign="center" mt={3}>
          <CustomButton> {t("ViewAllOfferings")}</CustomButton>
        </Box> */}
      </Box>
    </Box>
  );
};

export default OurOfferingComponent;
