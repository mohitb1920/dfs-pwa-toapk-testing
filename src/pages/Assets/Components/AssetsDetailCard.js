import { Box, Button, Typography, Grid, useTheme } from "@mui/material";
import React from "react";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import "../Style/AssetsStyle.css";
import UrlDialog from "../../../components/dialog/UrlDialog";
import useUrlDialog from "../../../Hooks/useUrlDialog";
import { ImageCarouselComponent } from "../../MainLandingPage/Components/ImageCarouselComponent";
import { capitalize } from "../../../components/Utils";

function AssetsDetailCard({
  assets,
  t,
  language,
  latitude,
  longitude,
  isDetailsPage = false,
  name,
  categoryId,
  isDataCleanup = false,
  isMobile,
}) {
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();
  const imageList = assets?.pictures?.map((picture) => picture.url) ?? null;
  const theme = useTheme();
  const isInvalidLocation =
    latitude == null ||
    longitude == null ||
    (assets.address?.latitude === 0 && assets.address?.longitude === 0);
  return (
    <Box
      className="assets-details-card"
      sx={{ maxWidth: isDetailsPage ? "1200px" : "792px" }}
    >
      <Grid container spacing={2} alignItems="flex-start">
        {/* Image Carousel Section */}
        {![1, 18, 20, 21, 22, 24].includes(categoryId) && (
          <Grid
            item
            xs={12}
            lg={!isDetailsPage ? 2.5 : 4}
            sx={{
              display: "flex",
              justifyContent: isDetailsPage ? "center" : "center",
            }}
          >
            <Box
              className="flex justify-end w-full"
              sx={{
                height: isDetailsPage ? "485px" : "140px",
                width: isDetailsPage ? "485px" : "140px",
                overflow: "hidden",
              }}
            >
              <ImageCarouselComponent
                imageUrls={imageList}
                height={"none"}
                borderRadius={"0px"}
                showDots={false}
                showIcons={isDetailsPage}
                nullImagepadding={isDetailsPage ? "px-[3rem]" : "px-[1rem]"}
              />
            </Box>
          </Grid>
        )}

        {/* Asset Details Section */}
        <Grid
          item
          xs={12}
          lg={
            ![1, 18, 20, 21, 22, 24].includes(categoryId)
              ? !isDetailsPage
                ? 9
                : 8
              : 12
          }
        >
          {assets?.name && (
            <Box className="card-data card-flex pb-3 sm:pb-4">
              <Typography
                variant={isDetailsPage && !isMobile ? "h2" : "h6"}
                style={{
                  color: theme.palette.text.primary,
                  fontWeight: "700",
                }}
              >
                {capitalize(assets?.name)}
              </Typography>
            </Box>
          )}
          <Box className="card-data card-flex">
            {isDetailsPage && name && (
              <Box className="PhoneMailContainerAsset  !mb-4">
                <Typography variant="body2" color={theme.palette.text.textGrey}>
                  {capitalize(name)}
                </Typography>
              </Box>
            )}
            {assets?.manager && (
              <Box
                className={`PhoneMailContainerAsset ${
                  isDetailsPage ? "borderClass" : ""
                }  !mb-4`}
              >
                <Typography variant="body2" color={theme.palette.text.textGrey}>
                  {t("contactPerson")}: {"  "}
                  <span> {assets.manager}</span>
                </Typography>
              </Box>
            )}

            {assets?.additionalFields?.fields?.map((e, index) => {
              if (e.key === "cropName") {
                return (
                  <Box
                    className={`PhoneMailContainerAsset ${
                      isDetailsPage ? "borderClass" : ""
                    }  !mb-4`}
                    key={index}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.text.textGrey}
                    >
                      {t("cropName")}
                      {"  "}
                      <span>{capitalize(e.value)}</span>
                    </Typography>
                  </Box>
                );
              }
            })}
          </Box>
          <Box className="card-data card-flex ">
            {assets?.additionalFields?.fields?.map((e, index) => {
              if (e.key === "activities") {
                return (
                  <Box className={`PhoneMailContainerAsset  !mb-4`} key={index}>
                    <Typography
                      variant="body2"
                      color={theme.palette.text.textGrey}
                    >
                      {t("activities")}
                      {": "} &nbsp;
                      <span>{capitalize(e.value)}</span>
                    </Typography>
                  </Box>
                );
              }
            })}
            {[20].includes(categoryId) && assets?.storageCapacity > 0 && (
              <Box className={`PhoneMailContainerAsset  !mb-4`}>
                <Typography variant="body2" color={theme.palette.text.textGrey}>
                  {t("help.Capacity")}
                  {": "} &nbsp;
                  <span>
                    {assets?.storageCapacity} {t("kg")}
                  </span>
                </Typography>
              </Box>
            )}
          </Box>
          {/* Contact Details */}
          <Box
            className="card-data card-flex mb-0"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              mb: "0px !important",
            }}
          >
            {assets?.contactNumber && (
              <Box className="PhoneMailContainer1">
                <PhoneRoundedIcon className="IconWrapper" />
                <Typography variant="body2">{assets.contactNumber}</Typography>
              </Box>
            )}
            {assets?.contactEmail && (
              <Box className="PhoneMailContainer1">
                <MailOutlineRoundedIcon className="IconWrapper" />
                <Typography variant="body2">{assets.contactEmail}</Typography>
              </Box>
            )}
          </Box>

          {/* Address and Direction Button */}
          <Box
            className="card-flex direction "
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            {assets?.address && (
              <Box className="PhoneMailContainer1">
                <LocationOnOutlinedIcon className="IconWrapper" />
                <Typography variant="body2">
                  {capitalize(assets.address?.block)}
                  {assets.address?.block && ", "}
                  {capitalize(assets.address?.district)}
                  {assets?.distance != null && (
                    <>
                      {" "}
                      <span style={{ color: theme.palette.text.darkGreyGreen }}>
                        {parseFloat(assets.distance).toFixed(1)}Km
                      </span>
                    </>
                  )}
                </Typography>
              </Box>
            )}
            {!isInvalidLocation && (
              <Button
                variant="secondary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleLinkClick(
                    `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${assets.address?.latitude},${assets.address?.longitude}&travelmode=driving`,
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

export default AssetsDetailCard;
