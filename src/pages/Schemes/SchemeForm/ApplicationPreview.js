import { Box } from "@mui/system";
import React from "react";
import { Typography } from "@mui/material";
import { Button } from "@mui/base";
import { useTranslation } from "react-i18next";
import { extractSchemas } from "../../../components/Utils";
import { existingSchema } from "../../../components/Constants";

function ApplicationPreview(props) {
  const { formData, setActiveStep } = props;
  const { t } = useTranslation();
  const steps = [];
  const extractedSchemas = extractSchemas(existingSchema, steps);

  const renderProperties = (jsonSchema) => {
    if (!jsonSchema.properties) {
      return null;
    }
    return Object.keys(jsonSchema.properties).map((key) => {
      const property = jsonSchema.properties[key];
      const title = property.title;

      return (
        <Box className="preview-item" key={key}>
          <Box className="preview-item-label">{title}</Box>
          <Box>{formData[key] === undefined ? " - " : formData[key]}</Box>
        </Box>
      );
    });
  };

  return (
    <Box className>
      <Box className="preview-header">{t("schemes.preview")}</Box>
      <Box className="preview-page">
        <Box>
          {extractedSchemas.map((schema) => (
            <>
              <Box className="scheme-category space-between">
                <Typography className="scheme-category-text color-blue">
                  {schema.title}
                </Typography>
              </Box>
              <Box className="details-container">
                {renderProperties(schema)}
              </Box>
            </>
          ))}
        </Box>
        <Box className="action-buttons-container">
          <Button
            variant="outlined"
            className="action-button edit"
            onClick={() => setActiveStep(0)}
            data-testid="edit-button"
          >
            Edit/Modify
          </Button>
          <Button variant="contained" className="action-button submit-button">
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default ApplicationPreview;
