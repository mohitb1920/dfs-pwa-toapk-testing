import { Box, Button, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { convertDateFormat } from "../../../components/Utils";
import PropTypes from "prop-types";

function SoilHealthCardCard({ data, path, onClick }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "assets/SchemeLogos/other_schemes.png";
  };

  return (
    <Box className="help-page-card">
      <Box className="help-main-card !justify-between h-full !gap-5">
        <Box className="help-main-card !gap-2">
          <Typography
            variant="h6"
            className="text-center text-card !font-bold"
            color={theme.palette.text.secondary}
          >
            {t("TestGrid")}: {data.TestGrid}
          </Typography>
          <Typography
            variant="body1"
            className="text-center text-card"
            color={theme.palette.text.textGrey}
          >
            {convertDateFormat(data.TestDate)}
          </Typography>
          <Typography
            variant="body1"
            className="text-center text-card"
            color={theme.palette.text.textGrey}
          >
            {t("KhataKasara")}: {data.KhataKhasra}
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
SoilHealthCardCard.propTypes = {
  data: PropTypes.any,
  path: PropTypes.any,
  onClick: PropTypes.func,
};
export default SoilHealthCardCard;
