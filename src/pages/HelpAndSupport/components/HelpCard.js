import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

function HelpCard({ data, path, onClick }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "assets/SchemeLogos/other_schemes.png";
  };

  return (
    <Box className="help-page-card">
      <Box className="help-main-card !justify-between h-full">
        <Box className="help-main-card">
          <Box
            component="img"
            className="schemes-page-card-logo"
            alt="Scheme logo"
            src={`assets/light/${data.image}`}
            onError={handleImageError}
          />
          <Typography
            variant="h6"
            className="text-center text-title-card !font-bold"
            color={theme.palette.text.secondary}
          >
            {t(data.title)}
          </Typography>
        </Box>
        <Button
          variant="secondary"
          className="know-more-button"
          onClick={() => onClick(data)}
        >
          {t("View")}
        </Button>
      </Box>
    </Box>
  );
}

export default HelpCard;
