import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { CommonAssetsCard } from "../../../components/cards/CommonAssetCard";
import "../Styles/AssetsHome.css";
import { AssetsHomeSkeletonLoader } from "../SkeletonLoader/SkeletonLoaders";
import { useAssetsData } from "../../../Hooks/useAssets";
import { useNavigate } from "react-router-dom";
import useGeolocation from "../../../Hooks/GetLocation";
import { toQueryString } from "../../../components/Utils";

const AssetsHome = ({ language, t }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  let {
    data: assets,
    isLoading: loading,
    refetch,
  } = useAssetsData({ language });
  const { getLocation } = useGeolocation();
  const isMobile = useMediaQuery("(max-width:640px)");

  const assetCardsRenderer = (index, span) => {
    return loading ? (
      <AssetsHomeSkeletonLoader count={5} />
    ) : (
      (assets?.slice(0, index) ?? []).map((category) => {
        const queryString = toQueryString({
          cat: category?.superCategoryCode,
          catId: category.subCategories[0]?.categorycode,
        });
        const targetUrl = `${window.contextPath}/assets-section?${queryString}`;
        return (
          <Grid item xs={span} sm={4} key={category.title}>
            <a
              href={targetUrl}
              target="_self"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <div className="homepage-asset-grid-item">
                <CommonAssetsCard
                  categoryName={category.title}
                  imageUrl={category.url}
                />
              </div>
            </a>
          </Grid>
        );
      })
    );
  };

  return (
    <>
      {isMobile ? (
        <Container variant="white">
          <Box className="assets-container-mobile">
            <Typography variant="h6" className="assets-title-mobile">
              {t("DFSWEB_ASSETS")}
            </Typography>
            <Grid container spacing={1} className="assets-grid">
              {assetCardsRenderer(4, 6)}
            </Grid>
            <Box className="!mt-3 flex justify-center">
              <Button
                variant="secondary"
                onClick={() => navigate(`${window.contextPath}/assets-section`)}
                className="!w-36 !font-semibold"
              >
                {t("COMMON_VIEW_ALL")}
              </Button>
            </Box>
          </Box>
        </Container>
      ) : (
        <Container variant="tertiaryGreen" className="assets-main-container">
          <Box className="assets-container inner-box-screen2">
            <Box className="assets-box ">
              <Box className="assets-header">
                <Typography variant="h1" className="assets-title">
                  {t("DFSWEB_ASSETS")}
                </Typography>
                <Typography
                  variant="h5"
                  className="assets-description"
                  color={"textSecondary"}
                >
                  {t("Assets_home_text")}
                </Typography>
              </Box>

              <Grid container spacing={5} className="assets-grid">
                {assetCardsRenderer(5, 12)}
              </Grid>
            </Box>
          </Box>
        </Container>
      )}
    </>
  );
};

export default AssetsHome;
