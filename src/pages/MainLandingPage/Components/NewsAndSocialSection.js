import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  useTheme,
} from "@mui/material";
import newsData from "./newsData.json";
import "../Styles/NewsAndSocialSection.css";
import {
  NewsSkeletonLoader,
  TwitterSkeletonLoader,
} from "../SkeletonLoader/SkeletonLoaders";
import useUrlDialog from "../../../Hooks/useUrlDialog";
import UrlDialog from "../../../components/dialog/UrlDialog";
import NewspaperOutlinedIcon from "@mui/icons-material/NewspaperOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { NewsAndSocialMediaService } from "../../../services/NewsAndSocialMediaService";
import TwitterCarouselComponent from "./TwitterCarouselComponent";
import { ThemeContext } from "../../../theme";

const NewsBulletin = ({ newsItems, readMore, onClick, theme }) => (
  <Card
    className="news-bulletin"
    sx={{
      padding: 2,
    }}
  >
    <CardContent className="!p-0" sx={{ borderRadius: "8px" }}>
      {" "}
      {newsItems.map((item) => (
        <Grid container key={item.id} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color={theme.palette.text.newsDate}>
              {item.date}
            </Typography>
            <Typography
              variant="body1"
              className="!font-semibold !mt-4"
              sx={{
                cursor: "pointer",
              }}
            >
              {/* Change link color */}
              <a
                onClick={(e) => onClick(item.link, e)}
                rel={item.link}
                style={{
                  color: `${theme.palette.text.secondary}`,
                  textDecoration: "underline",
                }} // Custom link color
              >
                {item.description}
              </a>
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={4}
            textAlign="right"
            className="!mt-3 !sm:mt-0"
          >
            {/* Change button color */}
            <Button
              size="small"
              variant="secondary"
              onClick={(e) => onClick(item.link)}
            >
              {readMore}
            </Button>
          </Grid>
          <Grid item xs={12}>
            <hr />
          </Grid>
        </Grid>
      ))}
    </CardContent>
  </Card>
);

const SocialMediaButtons = ({ onClick, ourTheme }) => (
  <Box
    alignItems="center"
    display="flex"
    borderRadius="15px"
    overflow="hidden"
    border="1px solid grey"
  >
    {/* <a
      onClick={(e) => onClick("https://www.facebook.com/BiharKrishiApp/")}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: "rgba(23, 119, 242, 1)" }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "5px 5px 5px 15px",
        }}
      >
        <img
          src={`${window.contextPath}/assets/facebook.svg`}
          style={{ marginRight: "10px" }}
        />

        <Typography fontSize="14px" marginRight="10px">
          Facebook
        </Typography>
      </Box>
    </a> */}
    <a
      target="_blank"
      rel="noopener noreferrer"
      color="primary"
      // sx={{ color: "rgba(23, 119, 242, 1)" }}
    >
      <Container
        variant="primaryGreen"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "5px 5px 5px 15px",
        }}
      >
        <img
          src={`${window.contextPath}/assets/Twitter.svg`}
          style={{
            marginRight: "10px",
            filter: ourTheme === "dark" ? "invert(1)" : "none",
          }}
          alt="twitter-logo"
        />
        <Typography fontSize="14px" marginRight="10px">
          X.com
        </Typography>
      </Container>
    </a>
  </Box>
);

const NewsAndSocialSection = ({ t, language, isMobile }) => {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingTwitter, setLoadingTwitter] = useState(true);
  const theme = useTheme();
  const [twitterData, setTwitterData] = useState([]);
  const { ourTheme } = useContext(ThemeContext);
  const fetchAssetsData = async (value) => {
    setLoadingTwitter(true);
    const response = await NewsAndSocialMediaService.makeTwitterCall();
    let twitter = [];
    if (response?.status === 200) {
      if (Array.isArray(response["data"])) twitter = response["data"];
      setTwitterData(twitter);
    }
    setLoadingTwitter(false);
  };
  const { open, externalUrl, handleLinkClick, handleClose } = useUrlDialog();
  useEffect(() => {
    // Simulate API call to fetch news
    setTimeout(() => {
      setNews(newsData["news"]);
      setLoadingNews(false);
    }, 20);
    fetchAssetsData();

    // Simulate delay for Twitter data
    setTimeout(() => {
      setLoadingTwitter(false);
    }, 1500);
  }, []);

  return (
    <Container
      variant="tertiaryGreen"
      id="latest-updates"
      className="news-social-main-box"
    >
      <Box className="news-social-section inner-box-screen2">
        <Grid container columnSpacing={4} rowSpacing={3}>
          {/* Latest News Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box display="flex" alignItems="center" mb={2}>
                <NewspaperOutlinedIcon
                  fontSize={isMobile ? "medium" : "large"}
                />
                {/* <img
                  src={`${window.contextPath}/assets/newspaper.svg`}
                  style={{ marginRight: "10px" }}
                  alt="news"
                /> */}
                <Typography
                  variant={isMobile ? "h6" : "h3"}
                  fontWeight="bold"
                  ml={1}
                >
                  {t("LatestNews")}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: "374px",
                  overflow: "scroll",
                  boxShadow: "0px 3px 3px 0px rgba(0, 0, 0, 0.2)",
                  marginBottom: "5px",
                  borderRadius: "12px",
                }}
              >
                {loadingNews ? (
                  <NewsSkeletonLoader />
                ) : (
                  <NewsBulletin
                    newsItems={news ?? []}
                    readMore={t("ReadMore")}
                    onClick={handleLinkClick}
                    theme={theme}
                  />
                )}
              </Box>
            </Box>
          </Grid>
          {/* Social Section */}
          <Grid item xs={12} md={6}>
            <Box>
              <Box
                display="flex"
                alignItems="start"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center">
                  <LanguageOutlinedIcon
                    fontSize={isMobile ? "medium" : "large"}
                  />
                  {/* <img
                    src={`${window.contextPath}/assets/newsection.svg`}
                    style={{ marginRight: "10px" }}
                    alt="news"
                  /> */}
                  <Typography
                    variant={isMobile ? "h6" : "h3"}
                    fontWeight="bold"
                    ml={1}
                  >
                    {t("Social")}
                  </Typography>
                </Box>
                <SocialMediaButtons
                  onClick={handleLinkClick}
                  ourTheme={ourTheme}
                />
              </Box>

              <Box
                className="news-section-twitter-card"
                bgcolor={theme.palette.background.primary}
              >
                {loadingTwitter ? (
                  <TwitterSkeletonLoader />
                ) : (
                  <TwitterCarouselComponent
                    tweets={twitterData}
                    handleLinkClick={handleLinkClick}
                    t={t}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {/* open dialog */}
      <UrlDialog
        open={open}
        externalUrl={externalUrl}
        handleClose={handleClose}
        t={t}
      />
    </Container>
  );
};

export default NewsAndSocialSection;
