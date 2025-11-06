import { Box, IconButton, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import "../../../styles/Homepage.css";
import PauseOutlinedIcon from "@mui/icons-material/PauseOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
export const ImageCarouselComponent = ({
  images,
  imageUrls,
  imageSaved,
  height = "100%",
  width = "100%",
  showDots = true,
  borderRadius = "12px",
  showIcons = true,
  nullImagepadding = "12px",
  showPlayPause = false,
}) => {
  const theme = useTheme();
  const [isPaused, setIsPaused] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const size = images?.length ?? imageUrls?.length ?? 0;

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount or when isPaused changes
    }
  }, [currentImage, isPaused]); // Dependency on both currentImage and isPaused

  const handleNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % size);
  };

  const handlePrev = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + size) % size);
  };

  const handlePlayPause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <Box sx={{ position: "relative", overflow: "hidden", width: "100%" }}>
      {/* Left side: Image carousel */}
      <Box className="flex justify-center  h-full w-full">
        {images == null && imageUrls?.[currentImage] == null && (
          <img
            className={nullImagepadding}
            src={`${window.contextPath}/assets/noImage.svg`}
            alt="app banner images"
          />
        )}
        {images != null && (
          <Box
            component="img"
            src={`${window.contextPath}/assets/${images[currentImage]}`}
            alt={images[currentImage]}
            sx={{
              width: width,
              borderRadius: borderRadius,
            }}
          />
        )}

        {imageUrls != null && (
          <img
            src={imageUrls[currentImage]}
            alt={imageUrls[currentImage]}
            onError={(e) => {
              e.target.src = `${window.contextPath}/assets/noImage.svg`;
              e.target.classList.add(nullImagepadding);
              e.target.style.width = "";
              e.target.style.height = "";
              e.target.style.borderRadius = "";
              e.target.style.objectFit = "";
            }}
            style={{
              width: width,
              height: height,
              borderRadius: borderRadius,
              border: "none",
              objectFit: "cover",
            }}
          />
        )}
      </Box>
      {showIcons && (
        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
          }}
          aria-label="Previous"
        >
          <ArrowBackIosNewIcon className="iconButton-image " />
        </IconButton>
      )}
      {showIcons && (
        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
          }}
          aria-label="Next"
        >
          <ArrowForwardIosIcon className="iconButton-image " />
        </IconButton>
      )}
      {showPlayPause && (
        <IconButton
          onClick={handlePlayPause}
          className="!absolute top-[90%] left-[45px] translate-y-[-50%] z-10"
          aria-label="Play or Pause"
        >
          {isPaused ? (
            <PlayArrowOutlinedIcon
              className="iconButton-image "
              style={{ color: "black" }}
            />
          ) : (
            <PauseOutlinedIcon
              className="iconButton-image "
              style={{ color: "black" }}
            />
          )}
        </IconButton>
      )}

      {showDots && (
        <Box className="homepage-carousel-stepper" mt={1}>
          <Box className="image-courosal-dots-box">
            {images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: index === currentImage ? "16px" : "12px",
                  height: index === currentImage ? "16px" : "12px",
                  borderRadius: "100%",
                  backgroundColor:
                    index === currentImage
                      ? "rgba(28, 33, 30, 1)"
                      : "rgba(255, 255, 255, 1)",
                  mx: 0.5,
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
