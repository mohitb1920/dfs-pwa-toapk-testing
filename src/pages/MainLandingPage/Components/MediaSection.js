import React from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import SlideshowOutlinedIcon from "@mui/icons-material/SlideshowOutlined";
import { ImageCarouselComponent } from "./ImageCarouselComponent";
import BiharKrishiRadio from "../../../components/Radio/BiharKrishiRadio";
import RadioIcon from "@mui/icons-material/Radio";

const images = [
  "imageCrousal1.jpeg",
  "imageCrousal2.jpeg",
  "imageCrousal3.jpeg",
  "imageCrousal4.jpeg",
];

const videos = [
  "https://www.youtube.com/embed/e5SHs9n1nCs?si=L1wjPNIenFxgon0c",
];

const MediaSection = ({ t, language, isMobile }) => {
  return (
    <Container variant="primary">
      <Box
        className="inner-box-screen2"
        sx={{ margin: "auto", paddingBottom: "80px" }}
      >
        {/* Photos Section */}
        <Grid container columnSpacing={4}>
          <Grid item xs={12} md={4} mb={3}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <ImageOutlinedIcon fontSize={isMobile ? "medium" : "large"} />
                <Typography
                  variant={isMobile ? "h6" : "h3"}
                  className="!font-bold"
                  ml={1}
                >
                  {t("Photos")}
                </Typography>
              </Box>
              <Box
                className="flex justify-end w-full h-52 sm:h-[222px] object-cover"
                sx={{
                  overflow: "hidden",
                }}
              >
                <ImageCarouselComponent
                  images={images}
                  height={"none"}
                  borderRadius={"12px"}
                  showDots={false}
                />
              </Box>
            </Box>
          </Grid>

          {/* Videos Section */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <SlideshowOutlinedIcon fontSize={isMobile ? "medium" : "large"} />
              <Typography
                variant={isMobile ? "h6" : "h3"}
                className="!font-bold"
                ml={1}
              >
                {t("Videos")}
              </Typography>
            </Box>
            {videos.map((video, index) => (
              <Box key={index} mb={2} sx={{ borderRadius: "12px" }}>
                <iframe
                  width="100%"
                  height={isMobile ? "208px" : "222px"}
                  style={{ borderRadius: "inherit" }}
                  src={video}
                  title={`Video ${index}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <RadioIcon fontSize={isMobile ? "medium" : "large"} />
              <Typography
                variant={isMobile ? "h6" : "h3"}
                className="!font-bold"
                ml={1}
              >
                {t("Radio")}
              </Typography>
            </Box>
            <BiharKrishiRadio t={t} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MediaSection;
