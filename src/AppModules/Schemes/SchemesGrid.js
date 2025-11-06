import { Box, useTheme } from "@mui/material";
import { getCurrentLanguage } from "../../components/Utils";
import { useNavigate } from "react-router-dom";
import SchemeCard from "../../components/SchemeCard";
import { useTranslation } from "react-i18next";

function SchemesGrid({ data, isSchemesPage, isMobile }) {
  const languagef = getCurrentLanguage();
  const language = languagef === "hi_IN" ? "hi" : "en";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  function handleClick(row) {
    const schemeId = row.id;
    const active = row.isApplyEnabled;

    let path = "details";
    if (!isSchemesPage) path = `${window.contextPath}/schemes/details`;
    navigate(path, {
      state: {
        mainId: row.mainId,
        schemeId,
        active,
        level: row.schemeLevel,
        url: row.url,
        redirect: row.redirect,
        startDate: row.startDate,
        endDate: row.endDate,
        modifyDate: row.modifyDate,
      },
    });
  }

  if (!data || data.length === 0) {
    return (
      <Box
        bgcolor={theme.palette.background.tertiaryGreen}
        className="no-schemes"
      >
        {t("schemes.noSchemes")}
      </Box>
    );
  }

  return (
    <Box
      className={
        isMobile && !isSchemesPage
          ? "flex justify-between gap-3"
          : "schemes-grid"
      }
    >
      {data.map((scheme, index) => (
        <SchemeCard
          active={scheme.isApplyEnabled}
          isNew={scheme.isNew}
          key={index}
          scheme={scheme}
          language={language}
          onClick={handleClick}
          isSchemesPage={isSchemesPage}
          isMobile={isMobile}
        />
      ))}
    </Box>
  );
}

export default SchemesGrid;
