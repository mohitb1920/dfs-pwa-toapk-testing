import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useNavigate } from "react-router-dom";
const DFS_WEB_HELP_LABEL = "Welcome to Help and Support!!";
const helpData = [
  {
    title: "Speak To DOA Officials/Call us",
    image: "DOA-Officials_help.png",
  },
  {
    title: "DBT ID Related Services",
    image: "DBT-ID_help.png",
  },
  {
    title: "Other Relevant Services",
    image: "OtherRelevantServices_help.png",
  },
  {
    title: "Other Relevant Services",
    image: "OtherRelevantServices-2_help.png",
  },
  {
    title: "Certification Inspectors(senior branch of inspection)",
    image: "CertificationInspectors_help.png",
  },
  {
    title: "SAO",
    image: "SAO_help.png",
  },
  {
    title: "GRM",
    image: "GRM_help.png",
  },
];
function HelpPage() {
  const handleGoBack = () => {
    navigate("/home");
  };

  const navigate = useNavigate();

  function handleClick(scheme) {
    navigate("grm-apply", { state: { scheme } });
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        columnGap: "1rem",
        padding: "10px",
        backgroundColor: "#F2F1EB",
        minHeight: "1280px",
      }}
    >
      <IconButton
        onClick={handleGoBack}
        sx={{ width: "fit-content", margin: "20px 1.5%" }}
      >
        <ArrowBackIcon />
      </IconButton>
      <Box
        width="95%"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: "15px",
          columnGap: "1rem",
          backgroundColor: "#D8D9DA",
          borderRadius: "2rem",
          marginLeft: "2%",
          marginBottom: "20px",
          minHeight: "300px",
        }}
      ></Box>

      <Box width="95%" sx={{ marginLeft: "2%", marginBottom: "20px" }}>
        <Typography sx={{ fontSize: "1.5rem" }}>
          {DFS_WEB_HELP_LABEL}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: { xs: "center", sm: "center", md: "left" },
            marginTop: "20px",
            rowGap: "1rem",
            gap: "10px",
            flexWrap: "wrap",
            backgroundColor: "#F2F1EB",
            borderRadius: "1rem",
          }}
        >
          {helpData.map((e, index) => {
            return (
              <Box
                width="15rem"
                height="fit-content"
                sx={{
                  display: "flex",
                  maxWidth: "15rem",
                  minHeight: "8rem",
                  justifyContent: "center",
                  textAlign: "center",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  backgroundColor: "#fff",
                  borderColor: "#B2B1B9",
                  borderRadius: "1rem",
                  borderWidth: "1px",
                  flexGrow: "1",
                  cursor: "pointer",
                }}
                onClick={() => handleClick(index)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={`${window.contextPath}/assets/${e.image}`}
                    sx={{ width: "9rem", height: "4rem", marginTop: "10px" }}
                  />
                  <Box sx={{ padding: "1rem 1rem", minHeight: "80px" }}>
                    <Typography
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        textWrap: "wrap",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        lineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {e.title}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default HelpPage;
