import { Box, Button } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SupportCard = (props) => {
  const { t } = useTranslation()
  const { image, text, path, navigate, action} = props;
  return (
    <Box className="support-card">
      <Box className="py-0 px-2 h-[85px] flex flex-row ">
        <Box className="relative p-2 min-h-[70px] min-w-[70px]">
          <img
            src={`${window.contextPath}/assets/${image}`}
            className="h-full w-full"
            alt=""
          />
        </Box>
        <Box className="p-3">
          <Box className="support-card-header">{t(text)}</Box>
        </Box>
      </Box>
      <Box className="px-3 pb-2">
        <Button
          variant="outlined"
          color="success"
          className="support-card-button"
          onClick={() =>
            navigate(`${window.contextPath}/technical-support/${path}`)
          }
        >
          {t(action)}
        </Button>
      </Box>
    </Box>
  );
};

const cardsInfo = [
  {
    image: "reportissue.svg",
    text: "REPORT_A_ISSUE",
    path: "report-issue",
    action: "Report",
  },
  {
    image: "trackissue.svg",
    text: "TRACK_ISSUE_STATUS",
    path: "track-issue",
    action: "Track",
  },
];

function SupportLandingPage() {
  const navigate = useNavigate();
  return (
    <div className="support-cards-container">
      {cardsInfo.map((card, index) => (
        <SupportCard
          key={index}
          path={card.path}
          image={card.image}
          text={card.text}
          navigate={navigate}
          action={card.action}
        />
      ))}
    </div>
  );
}

export default SupportLandingPage;
