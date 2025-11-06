import {
  Box,
  Grid,
  Typography,
  Link,
  Button,
  Tooltip,
  Container,
} from "@mui/material";
import React, { useState } from "react";
import "../styles/Footer.css";
import Slider from "react-slick";
import "../styles/AppBar.css";
import { getRoleBasedFooterLinks } from "./Utils";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import useUrlDialog from "../Hooks/useUrlDialog";
import UrlDialog from "./dialog/UrlDialog";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material"; // Sample icons

export const Footer = ({ initData }) => {
  const { t } = useTranslation();

  const settings = {
    dots: false,
    infinite: true,
    speed: 9000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    cssEase: "linear",
    autoplaySpeed: 3000,
    adaptiveHeight: true,
    arrows: true,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const jsonData = {
    imageList: [
      {
        src: "/assets/DigitalIndia.svg",
        alt: "Digital India Logo",
        link: "https://www.digitalindia.gov.in/",
      },
      {
        src: "/assets/Indiagov.svg",
        alt: "Government of India Logo",
        link: "https://www.india.gov.in/",
      },
      {
        src: "/assets/mygov.svg",
        alt: "My Government Logo",
        link: "https://www.mygov.in/",
      },
    ],
    socialMedia: [
      {
        src: "/assets/meta.svg",
        srcH: "/assets/meta-h.svg",
        alt: "Image 1",
        link: "https://www.facebook.com/BiharKrishiApp/",
      },
      {
        srcH: "/assets/newX-h.svg",
        src: "/assets/newX.svg",
        alt: "Image 3",
        link: "https://x.com/AppKrishi",
      },
      {
        srcH: "/assets/youtube-h.svg",
        src: "/assets/youtube.svg",
        alt: "Image 2",
        link: "https://www.youtube.com/@BiharKrishiApp",
      },
    ],
  };
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();

  const navigate = useNavigate();
  const footerLinks = getRoleBasedFooterLinks();
  const handleMenuClick = (path, link) => (e) => {
    if (path != null) {
      navigate(path);
    } else if (link != null) {
      handleLinkClick(link, e);
      // window.open(link, "_blank");
    }
  };

  return (
    <footer>
      <Container variant="tertiaryGreen" className="image-div">
        <Box className="py-6" sx={{ width: "calc(100vw - 100px)" }}>
          <Slider {...settings}>
            {[...jsonData?.imageList, ...jsonData?.imageList].map(
              (image, index) => (
                <Box
                  key={index}
                  sx={{
                    textAlign: "center",
                    px: 2,
                    cursor: "pointer",
                  }}
                >
                  <a
                    onClick={(e) => handleLinkClick(image.link, e)}
                    rel="noopener noreferrer"
                  >
                    <img
                      src={image.src}
                      className="svgIcon backgroundColorSvgFooter"
                      alt={image.alt}
                    />
                  </a>
                </Box>
              )
            )}
          </Slider>
        </Box>
      </Container>

      <Box id="Footer" tabindex="-1" className="footer-container">
        <Box
          className="inner-box-screen"
          // sx={{ paddingBottom: "20px !important" }}
        >
          <Grid container spacing={5}>
            {/* QR Code and Download Section */}
            <Grid
              item
              xs={12}
              sm={3}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box className="qr-section">
                <TopLineWithDot />
                <Box
                  component="img"
                  src={`${process.env.PUBLIC_URL}/assets/BiharKrishiLogo.png`}
                  // width="100px"
                  height="100px"
                  sx={{ objectFit: "contain", pb: 1, pt: 2 }} // Ensure image scales correctly
                  alt="QR Code"
                />

                <Typography variant="body2" className="qr-text">
                  {t("scan_to_download")}
                </Typography>

                <Button
                  onClick={(e) =>
                    handleLinkClick(
                      "https://play.google.com/store/apps/details?id=com.dfs.biharkrishi&hl=en_IN",
                      e
                    )
                  }
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pt: "24px",
                  }}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                    alt="Google Play"
                    // style={{ width: "100px" }}
                  />
                </Button>
              </Box>
            </Grid>
            {footerLinks?.map((linkItem, index) => (
              <Grid
                item
                xs={12}
                sm={3}
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                }}
                id={linkItem.header}
              >
                <Typography
                  variant="h6"
                  className="link-header"
                  textAlign="start"
                >
                  {t(linkItem.header)}
                </Typography>
                {linkItem.list.map((item, idx) => (
                  <Box id={item.title}>
                    <Button
                      disableFocusRipple
                      variant="text"
                      size="small"
                      key={idx}
                      className="link-item footer-link"
                      sx={{
                        textAlign: "start",
                      }}
                      onClick={handleMenuClick(item?.path, item?.link)}
                    >
                      {t(item.title)}
                    </Button>
                    {item?.contact && (
                      <Tooltip title={t(item.contact)}>
                        {item?.icon === "PhoneIcon" ? (
                          <PhoneRoundedIcon
                            style={{
                              color: "white",
                              marginRight: "5px",
                            }}
                          />
                        ) : item?.icon === "EmailIcon" ? (
                          <MailOutlineRoundedIcon
                            style={{
                              color: "white",
                              marginRight: "5px",
                            }}
                          />
                        ) : null}
                        <Typography variant="caption">
                          {t(item.contact)}
                        </Typography>
                      </Tooltip>
                    )}
                  </Box>
                ))}
                {/* Social Links */}
                {index === 2 && (
                  <>
                    <Typography
                      variant="h6"
                      color="#7FB293"
                      textAlign="center"
                      className="link-header"
                      sx={{ paddingTop: 2 }}
                    >
                      {t("FollowUs")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "start", // Center all social icons horizontally
                        alignItems: "start",
                      }}
                    >
                      {jsonData?.socialMedia.map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            textAlign: "start",
                            px: 2,
                            justifyContent: "start",
                            paddingLeft: "0px",
                            cursor: "pointer",
                          }}
                        >
                          <Link
                            component="button"
                            onClick={(e) => handleLinkClick(image.link, e)}
                            rel="noopener noreferrer"
                            sx={{
                              color: "rgba(23, 119, 242, 1)",
                              height: "40px",
                              width: "40px",
                            }}
                          >
                            <ImageHoverEffect
                              hoverSrc={`${window.contextPath}${image.src}`}
                              defaultSrc={`${window.contextPath}${image.srcH}`}
                              altText="YouTube"
                            />
                          </Link>
                        </Box>
                      ))}
                    </Box>
                  </>
                )}
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* copyright bar */}
        <Box className="outer-box-copyright">
          <Box className="inner-box-screen copyrightText-box">
            <Typography
              variant="body2"
              fontSize={".0.875rem"}
              textAlign={"center"}
            >
              {t("copyright")} © 2024 {t("DepartofAgri")}, {t("govtOfBihar")}
            </Typography>
            <Typography
              variant="body2"
              fontSize={".0.875rem"}
              textAlign={"center"}
            >
              {t("lastUpdate")} :{" "}
              {initData?.releaseInfo?.webApp?.["release-date"] ?? " - "}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* open dialog */}
      <UrlDialog
        open={open}
        externalUrl={externalUrl}
        handleClose={handleClose}
        t={t}
      />
    </footer>
  );
};
const TopLineWithDot = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ position: "relative", marginBottom: "20px" }}
    >
      <Box
        sx={{
          width: "60%",
          height: "4px",
          backgroundColor: "white",
          position: "absolute",
          left: "16%",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "-4px",
          left: "80%",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: "white",
        }}
      />
    </Grid>
  );
};
const ImageHoverEffect = ({ defaultSrc, hoverSrc, altText }) => {
  const [src, setSrc] = useState(defaultSrc);

  return (
    <img
      src={src}
      alt={altText}
      onMouseEnter={() => setSrc(hoverSrc)}
      onMouseLeave={() => setSrc(defaultSrc)}
      className="image-hover-effect"
      style={{
        transition: "all 0.5s ease-in-out",
      }}
    />
  );
};

const CustomArrow = ({ onClick, direction }) => {
  const theme = useTheme();
  const iconColor = "#000";

  return (
    <IconButton
      onClick={onClick}
      style={{
        borderRadius: "50% !important",
        backgroundColor: "rgba(255, 255, 255, 1)",
      }}
      sx={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1,

        color: iconColor,
        [direction === "left" ? "left" : "right"]: "-40px",
      }}
      aria-label={direction === "left" ? "left" : "right"}
    >
      {direction === "left" ? <NavigateBefore /> : <NavigateNext />}
    </IconButton>
  );
};
