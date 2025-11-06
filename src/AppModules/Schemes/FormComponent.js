import React, { useEffect } from "react";
import { getCurrentLanguage } from "../../components/Utils";
import { Box, Typography, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import FormFields from "./FormFields";

function FormComponent(props) {
  const { scheme } = props;
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const { t, i18n } = useTranslation();
  const theme = useTheme()

  return (
    <Box className="scheme-form-component-box">
      <Typography variant="h5" className="scheme-form-component-title" color={theme.palette.text.primary}>
        {t(
          scheme[`title-${i18n.language === "hi_IN" ? "hi" : "en"}`] ||
            scheme[`title`]
        )}
      </Typography>
      <FormFields
        language={i18n.language === "hi_IN" ? "hi" : "en"}
        {...props}
      />
    </Box>
  );
}

export default FormComponent;
