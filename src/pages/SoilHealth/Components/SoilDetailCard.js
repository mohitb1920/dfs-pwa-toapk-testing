import { Box, Button, Typography, Grid, useTheme } from "@mui/material";
import React from "react";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
import { capitalize } from "../../../components/Utils";
import { ImageCarouselComponent } from "../../MainLandingPage/Components/ImageCarouselComponent";
import useUrlDialog from "../../../Hooks/useUrlDialog";
import UrlDialog from "../../../components/dialog/UrlDialog";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import NearMeIcon from "@mui/icons-material/NearMe";
import PropTypes from "prop-types";
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function SoilDetailCard({
  data,
  t,
  language,
  latitude,
  longitude,
  isDetailsPage = false,
  name,
  isMobile,
}) {
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();
  const imageList = data?.pictures?.map((picture) => picture.url) ?? null;
  const theme = useTheme();
  return (
    <Box className="assets-details-card" sx={{ maxWidth: "1200px" }}>
      <Grid container spacing={2} alignItems="flex-start">
        {/* Image Carousel Section */}
        <Grid
          item
          xs={12}
          lg={2.5}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            className="flex justify-end w-full"
            sx={{
              height: "140px",
              width: "140px",
              overflow: "hidden",
            }}
          >
            <ImageCarouselComponent
              imageUrls={imageList}
              height={"none"}
              borderRadius={"0px"}
              showDots={false}
              showIcons={false}
              nullImagepadding={"px-[1rem]"}
            />
          </Box>
        </Grid>

        {/* Asset Details Section */}
        <Grid item xs={12} lg={9}>
          {data?.name && (
            <Box className="card-data card-flex pb-3 sm:pb-4">
              <Typography
                variant={isDetailsPage && !isMobile ? "h2" : "h6"}
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: "700",
                }}
              >
                {capitalize(data?.name)}
              </Typography>
            </Box>
          )}

          <Box className="card-data card-flex">
            {data?.district && (
              <Box
                className={`PhoneMailContainerAsset ${
                  isDetailsPage ? "borderClass" : ""
                }  !mb-4`}
              >
                <Typography variant="body2">
                  {t("farmerRegistration.DISTRICT")}: {"  "}
                  <span style={{ fontWeight: 700 }}>
                    {capitalize(data.district)}
                  </span>
                </Typography>
              </Box>
            )}
          </Box>

          <Box className="card-data card-flex">
            {data?.officerDesignation && (
              <Box className="PhoneMailContainer1">
                <Person2OutlinedIcon className="IconWrapper" />
                <Typography variant="body2">
                  {t("contactPerson")}- {"  "} {data.officerDesignation}
                </Typography>
              </Box>
            )}
          </Box>
          {/* Contact Details */}
          <Box
            className="card-data card-flex mb-0 justify-start"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: "0px !important",
            }}
          >
            {data?.contactNumber && (
              <Box className="PhoneMailContainer1">
                <PhoneEnabledOutlinedIcon className="IconWrapper" />
                <Typography variant="body2">{data.contactNumber}</Typography>
              </Box>
            )}

            {data?.emailId && (
              <Box className="PhoneMailContainer1">
                <MailOutlineRoundedIcon className="IconWrapper" />
                <Typography variant="body2">{data.emailId}</Typography>
              </Box>
            )}
          </Box>
          <Box
            className="card-flex direction "
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box
              className="card-data card-flex mb-0 justify-start"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                mb: "0px !important",
              }}
            >
              {" "}
              {data?.address && (
                <Box className="PhoneMailContainer1">
                  <LocationOnOutlinedIcon className="IconWrapper" />
                  <Typography variant="body2">
                    {capitalize(data.address)}
                    {data.address?.block && ", "}
                    {data?.distance != null && (
                      <>
                        {" "}
                        <span
                          style={{ color: theme.palette.text.darkGreyGreen }}
                        >
                          {parseFloat(data.distance).toFixed(1)}Km
                        </span>
                      </>
                    )}
                  </Typography>
                </Box>
              )}
              {data?.latitude && data?.longitude && latitude && longitude && (
                <Box className="PhoneMailContainer1">
                  <NearMeIcon className="IconWrapper" />
                  <Typography variant="body2">
                    {/* {t("Distance")}- {"  "} */}
                    {haversineDistance(
                      latitude,
                      longitude,
                      data.latitude,
                      data.longitude
                    ).toFixed(1)}{" "}
                    KM {t("approx")}
                  </Typography>
                </Box>
              )}
            </Box>

            {latitude != null && longitude != null && (
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleLinkClick(
                    `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${data?.latitude},${data?.longitude}&travelmode=driving`,
                    e
                  );
                }}
              >
                {t("get_direction")}
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* open dialog */}
      <UrlDialog
        open={open}
        externalUrl={externalUrl}
        handleClose={handleClose}
        t={t}
      />
    </Box>
  );
}
SoilDetailCard.propTypes = {
  isMobile: PropTypes.bool,
  t: PropTypes.func,
  language: PropTypes.string,
  latitude: PropTypes.any,
  longitude: PropTypes.any,
  isDetailsPage: PropTypes.bool,
  name: PropTypes.any,
};
export default SoilDetailCard;
