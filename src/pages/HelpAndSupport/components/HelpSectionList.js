import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import { useTranslation } from "react-i18next";
import "../Styles/HelpAndSupport.css";
import useUrlDialog from "../../../Hooks/useUrlDialog";
import UrlDialog from "../../../components/dialog/UrlDialog";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

function HelpSectionList({ title, titleP, officials, capacityUnit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:640px)");
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(
    i18n.language === "en_IN" ? "en" : "hi"
  );
  useEffect(() => {
    setLanguage(i18n.language === "en_IN" ? "en" : "hi");
  }, [i18n.language]);
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();
  return (
    <Box className="card-Style-help">
      {title && (
        <Typography variant={isMobile ? "h6" : "h5"} className="!font-semibold">
          {t(`help.${title}`)}
        </Typography>
      )}

      {officials?.map((official) => (
        <Box className="help-card">
          {official?.name != null && official?.name != "" && (
            <Typography
              variant={isMobile ? "subtitle2" : "h6"}
              className="!font-semibold"
            >
              {/* {t("schemes.name")}
              {":"} &nbsp; */}
              {official?.name}
            </Typography>
          )}
          {official?.heading != null && official?.heading != "" && (
            <Typography
              variant={isMobile ? "subtitle2" : "h6"}
              className="!font-semibold"
            >
              {official?.heading?.[language] ?? official?.heading}
            </Typography>
          )}
          {official?.subHeading && (<Typography
            variant="body1"
            color={theme.palette.text.textGrey}
          >
            {official?.subHeading?.[language] ?? official?.subHeading}
          </Typography>)}
          {official?.description != null &&
            official.description != "" &&
            official?.description?.[language] != null && (
              <Typography>{official?.description?.[language]}</Typography>
            )}
          {official.url != null && official?.url?.link != "" && (
            <a
              onClick={(e) => handleLinkClick(official.url.link, e)}
              rel={official.url.link}
              style={{
                color: `${theme.palette.text.textGreen}`,
                cursor: "pointer",
                overflowWrap: "anywhere",
              }}
            >
              {official.url.link}
            </a>
          )}
          {official?.unitName != null && official?.unitName != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">{t("schemes.name")}</span>
              {": "}
              {official?.unitName}
            </Typography>
          )}
          {official?.status != null && official?.status != "" && (
            <Typography variant="body1">
              <span className="!font-semibold"> {t("help.status")}</span> {": "}
              {official?.status}
            </Typography>
          )}
          {official?.commoditiesTraded != null &&
            official?.commoditiesTraded != "" && (
              <Typography variant="body1">
                <span className="!font-semibold">
                  {t("help.commoditiesTraded")}
                </span>
                {": "}&nbsp;
                {official?.commoditiesTraded}
              </Typography>
            )}
          {official?.capacity != null && official?.capacity != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">{t("help.capacity")}</span>
              {": "}&nbsp;
              {official?.capacity}
              {capacityUnit ? "" : " klpd"}
            </Typography>
          )}
          {official?.establishYear != null && official?.establishYear != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">{t("help.establishYear")}</span>
              {": "}
              {official?.establishYear}
            </Typography>
          )}
          {official?.productName != null && official?.productName != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">{t("help.productName")}</span>
              {": "}
              {official?.productName}
            </Typography>
          )}
          {official?.majorCrops != null && official?.majorCrops != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">{t("help.majorCrops")}</span>
              {": "}
              {official?.majorCrops}
            </Typography>
          )}
          {/* <Box className="contact-details"> */}
          {official?.contactNo && (
            <div className="PhoneMailContainer">
              <PhoneRoundedIcon className="IconWrapper" />
              <Typography
                variant="body1"
                className="contact-email-id-text"
                color={theme.palette.text.textGrey}
              >
                {official.contactNo}
              </Typography>
            </div>
          )}
          {official?.mobileNo && (
            <div className="PhoneMailContainer">
              <PhoneRoundedIcon className="IconWrapper" />
              <Typography
                variant="body1"
                className="contact-email-id-text"
                color={theme.palette.text.textGrey}
              >
                {official.mobileNo}
              </Typography>
            </div>
          )}
          {official?.contact && (
            <div className="PhoneMailContainer">
              <PhoneRoundedIcon className="IconWrapper" />
              <Typography
                variant="body1"
                className="contact-email-id-text"
                color={theme.palette.text.textGrey}
              >
                {official.contact}
              </Typography>
            </div>
          )}
          {official?.email && (
            <div className="PhoneMailContainer">
              <MailOutlineRoundedIcon className="IconWrapper" />
              <Typography
                variant="body1"
                className="contact-email-id-text"
                color={theme.palette.text.textGrey}
              >
                {official.email}
              </Typography>
            </div>
          )}
          {official?.address && (
            <div className="PhoneMailContainer">
              <LocationOnOutlinedIcon className="IconWrapper" />
              <Typography
                variant="body1"
                className="contact-email-id-text"
                color={theme.palette.text.textGrey}
              >
                {official.address}
              </Typography>
            </div>
          )}
          {/* </Box> */}
          {official?.timings != null && official?.timings != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">
                {t("help.availableTimings")}
              </span>
              {": "}
              {official?.timings}
            </Typography>
          )}
          {official?.availableDay != null && official?.availableDay != "" && (
            <Typography variant="body1">
              <span className="!font-semibold">{t("help.availableDays")}</span>
              {": "}
              {official?.availableDay}
            </Typography>
          )}
        </Box>
      ))}
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

export default HelpSectionList;
