import { Box, Button, Link, Typography, CircularProgress } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SuccessApplyComponent({ schemeName, handleModalClose }) {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    navigate(`${window.contextPath}/schemes`);
  };

  if (!showContent) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "center",
        padding: "10px",
      }}
    >
      <Box
        component="img"
        sx={{
          height: 100,
          width: 100,
          maxHeight: { xs: 200, md: 200 },
          maxWidth: { xs: 200, md: 200 },
          margin: "auto 0",
        }}
        alt="The house from the offer."
        src={`${window.contextPath}/assets/Applied .gif`}
      />
      <Typography
        sx={{ margin: "20px 0px" }}
      >{`You have Successfully Applied for ${schemeName}`}</Typography>
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{
          color: "#FFFFFF",
          backgroundColor: "#1a5c4b",
          padding: "5px 14px",
          fontWeight: "400",
          textTransform: "none",
          borderColor: "#A5292B",
          borderWidth: "1px",
          borderRadius: "2rem",
          fontSize: "1rem",
          width: "100%",
        }}
      >
        Done
      </Button>
      <Box sx={{ display: "flex", padding: "10px 10px", margin: "10px 0", width: "100%", alignItems: "center", backgroundColor: "#F6F4F4", justifyContent: "space-around" }}>
        <Typography
          sx={{ fontSize: "0.8rem" }}
        >{`Do you wish to register on Bihar Krishi App?`}</Typography>
        <Link
          sx={{ fontSize: "0.8rem" }}
          href="www.google.com"
          underline="hover"
        >{`Register-here`}</Link>{" "}
      </Box>
    </Box>
  );
}

export default SuccessApplyComponent;