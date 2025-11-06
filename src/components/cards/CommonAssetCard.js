import { Box, Typography } from "@mui/material";
import React from "react";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import "../../pages/MainLandingPage/Styles/AssetsHome.css";

export const CommonAssetsCard = ({ categoryName, imageUrl }) => {
  return (
    <Box className="commonAssetsCard">
      <Box className="commonAssetsCardHeader">
        <Typography className="categoryName">{categoryName}</Typography>
        <ArrowForwardIosOutlinedIcon className="arrowIcon" />
      </Box>

      <Box className="imageContainer">
        <img src={imageUrl} alt="Category" className="categoryImage" />
      </Box>
    </Box>
  );
};
