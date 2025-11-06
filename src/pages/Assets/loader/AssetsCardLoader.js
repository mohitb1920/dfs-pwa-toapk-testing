import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";

export const AssetsCardLoader = ({ isDetailsPage }) => {
  return (
    <Box
      className="assets-details-card"
      sx={{ maxWidth: isDetailsPage ? "1200px" : "792px" }}
    >
      <Grid container spacing={0} alignItems="flex-start">
        {/* Image Carousel Section Skeleton */}
        <Grid
          item
          xs={12}
          lg={4}
          sx={{
            display: "flex",
            justifyContent: isDetailsPage ? "flex-end" : "center",
          }}
        >
          <Skeleton
            variant="rectangular"
            width={isDetailsPage ? 485 : 140}
            height={isDetailsPage ? 485 : 140}
            animation="wave"
          />
        </Grid>

        {/* Asset Details Section Skeleton */}
        <Grid item xs={12} lg={8}>
          {/* Asset name skeleton */}
          <Box className="card-data card-flex pb-3">
            <Skeleton
              variant="text"
              sx={{ fontSize: isDetailsPage ? "2rem" : "1.25rem" }}
              width={isDetailsPage ? "60%" : "40%"}
              animation="wave"
            />
          </Box>

          {/* Asset position skeleton */}
          <Box className="card-data card-flex">
            <Skeleton variant="text" width="30%" animation="wave" />
          </Box>

          {/* Contact Details Skeleton */}
          <Box
            className="card-data card-flex mb-0"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              mb: "0px !important",
            }}
          >
            <Box className="PhoneMailContainer1">
              <Skeleton variant="text" width="50%" animation="wave" />
            </Box>
            <Box className="PhoneMailContainer1">
              <Skeleton variant="text" width="50%" animation="wave" />
            </Box>
          </Box>

          {/* Address and Direction Button Skeleton */}
          <Box
            className="card-flex direction"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box className="PhoneMailContainer1">
              <Skeleton variant="text" width="70%" animation="wave" />
            </Box>
            <Skeleton
              variant="rectangular"
              width={120}
              height={35}
              animation="wave"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
export const AssetsHeaderLoader = ({ isDetailsPage }) => {
  return (
    <Box className="section-heading-container">
      <Skeleton variant="rectangular" width={90} height={90} animation="wave" />
      <Skeleton
        variant="text"
        sx={{ fontSize: "2rem", ml: 2 }}
        width={"40%"}
        animation="wave"
      />
    </Box>
  );
};
export const AssetsCategoryBarLoader = ({ isDetailsPage }) => {
  return (
    <>
      <Skeleton
        variant="text"
        sx={{ fontSize: isDetailsPage ? "2rem" : "1.25rem" }}
        width={isDetailsPage ? "60%" : "40%"}
        animation="wave"
      />
      {Array.from({ length: 6 })?.map((_, index) => (
        <Skeleton
          variant="text"
          sx={{ fontSize: "2rem" }}
          width={"60%"}
          animation="wave"
        />
      ))}
    </>
  );
};
