import { Avatar, Box, Typography } from "@mui/material";
import React from "react";
import DynamicSvgIcon from "../../../components/DynamicSvgIcon";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

export const ImageBox = ({
  name,
  designation,
  contact,
  image,
  height,
  width,
}) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="start">
      <Box className="flex justify-start  h-full w-full contents">
        <Box
          component="img"
          className="!mb-4 object-top self-center rounded-xl object-cover"
          src={image}
          alt={image}
          sx={{
            width: width,
            height: height,
            backgroundColor: "white",
          }}
        />
      </Box>

      {/* <Avatar
        variant="rounded"
        src={imgSrc}
        alt={name}
        sx={{ width: width, height: height, mb: 2 }}
      /> */}
      <Typography
        variant="h5"
        className="!font-bold"
        align="left"
        color="textSecondary"
      >
        {name}
      </Typography>
      <Typography variant="body2" align="left" color="textGrey">
        {designation}
      </Typography>
      <div style={{ display: "flex", paddingTop: "12px" }}>
        <PhoneRoundedIcon className="IconWrapper" />
        <Typography variant="body1" align="center" color="textGrey">
          {contact}
        </Typography>
      </div>
    </Box>
  );
};
