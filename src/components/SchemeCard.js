import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import TitleWithTooltip from "./TruncatedTitle";
import { useTheme } from "@mui/styles";

function SchemeCard({
  active,
  isNew,
  scheme,
  language,
  onClick,
  isSchemesPage,
  isMobile,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "assets/SchemeLogos/other_schemes.png";
  };

  let schemeLevel = "schemes.schemesForFarmers";
  if (scheme.schemeLevel === "state") schemeLevel = "schemes.stateScheme";
  else if (scheme.schemeLevel === "centrally_sponsored")
    schemeLevel = "schemes.centralSponsored";
  else if (scheme.schemeLevel === "central")
    schemeLevel = "schemes.centralScheme";

  const schemeStatusRenderer = () => {
    return (
      <Box sx={{ display: "flex", columnGap: "4px" }}>
        {false && (
          <Typography variant="subtitle2" className="schemes-page-card-new">
            {t("schemes.new")}
          </Typography>
        )}
        {active ? (
          <Typography variant="subtitle2" className="schemes-page-card-open">
            {t("schemes.open")}
          </Typography>
        ) : (
          <Typography variant="subtitle2" className="schemes-page-card-close">
            {t("schemes.closed")}
          </Typography>
        )}
      </Box>
    );
  };

  if (isMobile && !isSchemesPage) {
    return (
      <Box className="mobile-scheme-card">
        <Box className="flex flex-col gap-2">
          <Box>{schemeStatusRenderer()}</Box>
          <Box className="flex justify-center items-center">
            <Box
              component="img"
              className="schemes-page-card-logo"
              alt="Scheme logo"
              src={`assets/SchemeLogos/${scheme.id}.svg`}
              onError={handleImageError}
            />
          </Box>
          <Box className="h-28 flex flex-col justify-between">
            <Typography
              variant="h7"
              className="!font-medium"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {t(
                scheme.schemeName[`title-${language}`] ||
                  scheme.schemeName[`title`]
              )}
            </Typography>
            <Box className="flex flex-col gap-2">
              <Typography
                className="schemes-page-card-level"
                variant="caption"
                color={theme.palette.text.textGrey}
              >
                {t(schemeLevel)}
              </Typography>
              <Button
                variant="secondary"
                size="small"
                onClick={() => onClick(scheme)}
              >
                {t("KnowMore")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="schemes-page-card">
      <Box sx={{ display: "flex", rowGap: "24px", flexDirection: "column" }}>
        <Box sx={{ display: "flex", columnGap: "4px" }}>
          {false && (
            <Typography variant="subtitle2" className="schemes-page-card-new">
              {t("schemes.new")}
            </Typography>
          )}
          {active ? (
            <Typography variant="subtitle2" className="schemes-page-card-open">
              {t("schemes.open")}
            </Typography>
          ) : (
            <Typography variant="subtitle2" className="schemes-page-card-close">
              {t("schemes.closed")}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: "24px",
          }}
        >
          <Box
            component="img"
            className="schemes-page-card-logo"
            alt="Scheme logo"
            src={`assets/SchemeLogos/${scheme.id}.svg`}
            onError={handleImageError}
          />
          <Box sx={{ maxWidth: "100%" }}>
            <TitleWithTooltip
              className="schemes-page-card-title"
              color="textSecondary"
              title={t(
                scheme.schemeName[`title-${language}`] ||
                  scheme.schemeName[`title`]
              )}
              language={language}
            />
            <Typography
              className="schemes-page-card-level"
              variant="body2"
              color={theme.palette.text.textGrey}
            >
              {t(schemeLevel)}
            </Typography>
          </Box>
          <Button
            variant="secondary"
            className="know-more-button"
            onClick={() => onClick(scheme)}
          >
            {t("schemes.schemeKnowMore")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SchemeCard;
