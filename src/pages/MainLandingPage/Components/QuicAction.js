import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import "../Styles/QuickAction.css";
import { CommonCard } from "../../../components/cards/CommonCard";
import { useNavigate } from "react-router-dom";
const stats = [
  {
    id: 1,
    value: {
      en: "Farmer Registration",
      hi: "किसान पंजीकरण",
    },
    description: {
      en: "Register farmers account on Bihar Krishi for easy access to schemes, service and numerous benefits.",
      hi: "बिहार कृषि पर किसानों का खाता पंजीकृत करें ताकि योजनाओं, सेवाओं और अनेक लाभों तक आसान पहुंच हो सके।",
    },
    buttonText: "GotoRegistration",
    image: "FarmerRegSection.svg",
    url: "/registration",
  },
  {
    id: 2,
    value: {
      en: "Register a Grievance",
      hi: "शिकायत पंजीकरण करें",
    },
    description: {
      en: "Register farmer grievances regarding schemes, services or any other issues related to agriculture.",
      hi: "किसानों की शिकायतें पंजीकृत करें जो योजनाओं, सेवाओं या कृषि से संबंधित अन्य मुद्दों के बारे में हैं।",
    },
    buttonText: "CreateTicket",
    image: "GRMSection.svg",
    url: "/grm-create",
  },
  // {
  //   id: 3,
  //   value: {
  //     en: "Help and Support",
  //     hi: "सहायता और समर्थन",
  //   },
  //   description: {
  //     en: "Connect with agents on Kisan Call Center or find details of important points of contacts to solve your problems.",
  //     hi: "किसान कॉल सेंटर पर एजेंटों से जुड़ें या अपनी समस्याओं को हल करने के लिए महत्वपूर्ण संपर्क बिंदुओं के विवरण प्राप्त करें।",
  //   },
  //   buttonText: "ViewDetails",
  //   image: "HelpSection.svg",
  //   url: "/help",
  // },
];

const QuicAction = ({ t, language, isMobile }) => {
  const navigate = useNavigate();

  return (
    <Container variant="gradient" className="gradient-background">
      <Box className="quick-action-box inner-box-screen2">
        <Box className="title-box">
          <Typography
            variant={isMobile ? "h6" : "h2"}
            className="quick-action-title"
          >
            {t("QuickAction")}
          </Typography>
        </Box>

        <Grid container spacing={2} className="grid-container">
          {stats.map((stat) => (
            <Grid item xs={12} sm={4} key={stat.id}>
              <CommonCard
                value={stat.value[language]}
                description={stat.description[language]}
                buttonText={t(stat.buttonText)}
                image={stat.image}
                icons={true}
                paddingBlock="40px"
                onClick={() => {
                  navigate(`${window.contextPath}${stat.url}`);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default QuicAction;
