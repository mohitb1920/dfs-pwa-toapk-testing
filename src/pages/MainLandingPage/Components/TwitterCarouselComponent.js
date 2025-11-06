import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import "../Styles/TwitterCardStyles.css";

export const TwitterCard = ({ tweet }) => (
  <Card variant="white" sx={{ padding: 0 }}>
    <CardContent
      sx={{
        border: "1px solid grey",
        borderRadius: "8px",
        justifyContent: "space-between",
        display: "flex",
        flexDirection: "column",
        height: "auto",
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          component="img"
          src={`${window.contextPath}/assets/newX.svg`}
          alt="Twitter Logo"
          sx={{ width: 40, marginRight: 2 }}
        />
        {tweet?.userName != null && (
          <Typography variant="h6" component="div">
            {tweet?.userName}
          </Typography>
        )}
      </Box>
      {tweet?.postText != null && (
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          {tweet?.postText}
        </Typography>
      )}
      {tweet?.resourceUrl != null && tweet?.resourceUrl != "" && (
        <img
          src={tweet?.resourceUrl}
          alt="Tweet media"
          style={{ maxHeight: "200px", objectFit: "cover" }}
        />
      )}
    </CardContent>
  </Card>
);

function TwitterCarouselComponent({
  tweets,
  handleLinkClick,
  showDots = true,
  showIcons = true,
  t,
}) {
  const [currentTweet, setCurrentTweet] = useState(0);
  const size = tweets?.length ?? 0;
  const theme = useTheme();
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentTweet]);

  const handleNext = () => {
    setCurrentTweet((prevTweet) => (prevTweet + 1) % size);
  };

  const handlePrev = () => {
    setCurrentTweet((prevTweet) => (prevTweet - 1 + size) % size);
  };
  return (
    <Box className="flex-col justify-center  h-full w-full ">
      <Box
        sx={{
          height: "330px",
        }}
      >
        {tweets?.[currentTweet] != null && (
          <Box
            sx={{
              height: "330px",
              overflow: "scroll",
              gap: "12px",
              cursor: "pointer",
            }}
            href={tweets[currentTweet]?.postURL}
            onClick={(e) => handleLinkClick(tweets[currentTweet]?.postURL, e)}
          >
            <TwitterCard key={currentTweet} tweet={tweets[currentTweet]} />
          </Box>
        )}
        {tweets?.length == 0 && (
          <Box
            className="flex justify-center items-center"
            sx={{
              height: "330px",
            }}
            href={tweets[currentTweet]?.postURL}
            onClick={(e) => handleLinkClick(tweets[currentTweet]?.postURL, e)}
          >
            {t("MANDI_NO_MARKET_DATA")}
          </Box>
        )}
      </Box>
      <Box className="bottom-action-style">
        {showIcons && (
          <IconButton
            onClick={handlePrev}
            className="icon-pre-button !ml-2"
            aria-label="Previous"
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        )}
        {showDots && (
          <Box className="dots-style" mt={1}>
            {tweets?.map((_, index) => (
              <Box
                key={index}
                className="dot-index-style"
                sx={{
                  backgroundColor:
                    index === currentTweet
                      ? theme.palette.text.textGreen
                      : "grey",
                }}
              />
            ))}
          </Box>
        )}
        {showIcons && (
          <IconButton
            onClick={handleNext}
            className="icon-pre-button !mr-2"
            aria-label="Next"
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default TwitterCarouselComponent;
