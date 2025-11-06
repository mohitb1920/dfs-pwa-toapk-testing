import React, { useContext } from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import DynamicSvgIcon from "../../../components/DynamicSvgIcon";
import "../Styles/AnalyticsComponent.css";
import { OurOfferingSkeletonLoader } from "../SkeletonLoader/SkeletonLoaders";
import { CommonCard } from "../../../components/cards/CommonCard";
import { ThemeContext } from "../../../theme";
import { useAnalyticsData } from "../../../Hooks/useAnalyticsData";
import { useFileStoreData } from "../../../Hooks/useFileStoreData";

const AnalyticsComponent = ({ language, t }) => {
  const { ourTheme } = useContext(ThemeContext);
  let { data: farmerCount, refetch } = useAnalyticsData({
    indexName: "individual-index-v1",
    key: "farmerCount",
  });
  let { data: dbtFarmerCount } = useAnalyticsData({
    indexName: "individual-index-v1",
    field: "isDBTUser",
    key: "dbtFarmerCount",
  });
  const jsonUrl =
    "https://filestoragedfs.blob.core.windows.net/publicresources/json/AssistedMode/stats.json";
  const { data, isLoading } = useFileStoreData({
    url: jsonUrl,
    key: "stats",
  });
  return (
    <Container
      variant="gradient"
      id="success-volumes"
      className={"GradientBackground"}
    >
      <Box className={"ContentWrapper"}>
        <Box
          className="inner-box-screen2 m-auto"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            "@media (min-width: 768px)": {
              flexDirection: "row",
            },
            zIndex: 2,
          }}
        >
          <Box className={"TitleWrapper"}>
            <h1
              className={"TitleText"}
              dangerouslySetInnerHTML={{
                __html: `${t("NumberAboutOurSuccess", {
                  color:
                    ourTheme === "light"
                      ? "rgba(247, 213, 8, 1)"
                      : "rgba(133, 188, 49, 1)",
                })}`,
              }}
            />
          </Box>

          <Grid container spacing={3} sx={{ flex: 2 }}>
            {isLoading ? (
              [1, 2, 3].map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item}>
                  <OurOfferingSkeletonLoader />
                </Grid>
              ))
            ) : data?.["stats"] != null ? (
              data?.["stats"]?.map((stat) => (
                <Grid item xs={12} sm={4} key={stat.id}>
                  <CommonCard
                    value={
                      stat.id == 4
                        ? dbtFarmerCount?.["Count"] ?? stat.value
                        : stat.id == 1
                        ? farmerCount?.["Count"] ?? stat.value
                        : stat.value
                    }
                    description={stat[language].description}
                    image={`${ourTheme}/${stat.image}`}
                    paddingBlock="24px"
                  />
                </Grid>
              ))
            ) : (
              <Box className="no-item-style-help">
                <Typography variant="body1">
                  {t("MANDI_NO_MARKET_DATA")}
                </Typography>
              </Box>
            )}
          </Grid>
        </Box>

        <Box className={"LeafIcon2"}>
          <DynamicSvgIcon image={"Leaf2"} />
        </Box>
        <Box className={"LeafIcon3"}>
          <DynamicSvgIcon image={"Leaf"} />
        </Box>
      </Box>
    </Container>
  );
};

export default AnalyticsComponent;
